import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeleteResult, Repository } from "typeorm"
import { Category } from "./categorie.entity"
import { AddCategoryDto } from "./dtos/add-category.dto"
import slugify from "slugify"
import { LimitOffsetDto } from "../../shared/dtos/limit-offset.dto"
import { Banner } from "../banners/banners.entity"

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async add(data: AddCategoryDto): Promise<Category> {
    let url = slugify(data.title, { lower: true, strict: true })
    const existCategory = await this.repo.findOneBy({ url })
    if (existCategory) {
      throw new Error("Категория с таким названием уже существует")
    }
    const newCategory = this.repo.create({
      title: data.title,
      titleKz: data.titleKz,
      isActive: data.isActive ?? false,
      url
    })
    const savedCategory = await this.repo.save(newCategory)
    newCategory.sortOrder = newCategory.id
    return this.repo.save(savedCategory)
  }

  async update(id: number, data:AddCategoryDto): Promise<Category> {
    const category = await this.repo.findOneBy({ id: id })
    if (!category) {
      throw new Error("Category not found")
    }

    return await this.repo.save<Category>({ ...category, ...data })
  }

  getAll(query: LimitOffsetDto) {
    return this.repo
      .createQueryBuilder("category")
      .select([
        "category.id",
        "category.title",
        "category.url",
      ])
      .orderBy("category.sortOrder", "ASC")
      .take(query.limit)
      .skip(query.offset)
      .getMany()
  }

  getOne(url: string): Promise<Category> {
    return this.repo
      .createQueryBuilder("category")
      .select(["category.id", "category.title", "category.titleKz", "category.isActive"])
      .where({ url })
      .getOneOrFail()
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repo.delete(id)
  }
}
