import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly httpService: HttpService,
  ) {}

  async saveImage(base64EncodedImage: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', base64EncodedImage);

    try {
      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://freeimage.host/api/1/upload?key=${process.env.IMG_API_KEY}`,
            formData,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw new HttpException(
                `Image upload failed: ${error.message}`,
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
      return imageData.image.display_url;
    } catch (err) {
      // Rethrow known HttpException or wrap unexpected errors
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Unexpected error during image upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: number,
  ): Promise<Expense> {
    let imgUrl: string | null = null;
    if (createExpenseDto.img) {
      imgUrl = await this.saveImage(createExpenseDto.img as string);
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      img: imgUrl,
      byUserID: userId,
    });

    return this.expenseRepository.save(expense);
  }

  async findAll(userID: number): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { byUserID: userID } });
  }

  async findOne(id: number): Promise<Expense> {
    return this.expenseRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
