import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from "./categorie.entity"
import { AddCategoryDto } from "./dtos/add-category.dto"
import slugify from "slugify"
import { LimitOffsetDto } from "../../shared/dtos/limit-offset.dto"

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

  getAll(query: LimitOffsetDto) {
    return this.repo
      .createQueryBuilder("category")
      .select(["category.id", "category.title", "category.titleKz"])
      .orderBy("category.sortOrder", "ASC")
      .take(query.limit)
      .skip(query.offset)
      .getMany()
  }
}
