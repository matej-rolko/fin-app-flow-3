import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/authentication/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity,
  ): Promise<Category> {
    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      user: user,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(userId: UserEntity): Promise<Category[]> {
    return await this.categoryRepository.find({ where: { user: userId } });
  }

  async findOne(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
