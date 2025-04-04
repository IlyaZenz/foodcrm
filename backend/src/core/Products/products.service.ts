import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeleteResult, Repository } from "typeorm"
import { Product } from "./products.entity"
import { LimitOffsetDto } from "../../shared/dtos/limit-offset.dto"
import { AddProductDto } from "./dtos/add-product.dto"
import slugify from "slugify"
import { UpdateProductDto } from "./dtos/update-product.dto"
import { ProductVariant } from "./productVariant.entity"
import { AddVariantDto } from "./dtos/add-variant.dto"

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(ProductVariant) private relatedRepo: Repository<ProductVariant>
  ) {}

  async add(data: AddProductDto): Promise<Product> {
    let url = slugify(data.title, { lower: true, strict: true })
    const existProduct = await this.repo.findOneBy({ url })
    if (existProduct) {
      throw new Error("Категория с таким названием уже существует")
    }
    const newProduct = this.repo.create({
      title: data.title,
      url
    })
    const savedProduct = await this.repo.save(newProduct)
    newProduct.sortOrder = newProduct.id
    return this.repo.save(savedProduct)
  }

  async addProductVariant(
    id: number,
    data: AddVariantDto
  ): Promise<ProductVariant> {

    const newVariant = this.relatedRepo.create({
      title: data.title,
      product: {id},
      price: data.price,
    })

    const savedVariant = await this.relatedRepo.save(newVariant);
    savedVariant.sortOrder = savedVariant.id;

    return await this.relatedRepo.save(savedVariant);
  }

  getOne(url: string): Promise<Product> {
    return this.repo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.variants", "variant")
      .where({ url })
      .getOneOrFail()
  }

  getAll(query: LimitOffsetDto, category?: string) {
    return this.repo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("category.url = :categoryUrl", { categoryUrl: category })
      .orderBy("product.sortOrder", "ASC")
      .take(query.limit)
      .skip(query.offset)
      .getMany()
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.repo.findOneBy({ id: id })
    if (!product) {
      throw new Error("Product not found")
    }
    return await this.repo.save<Product>({ ...product, ...data })
  }

  deleteVariant(id: number){
    return this.relatedRepo.delete(id)
  }

  async delete(id: number): Promise<DeleteResult> {
    const product = await this.repo.findOne({
      where: { id },
      relations: ["variants"]
    })
    if (product) {
      await this.relatedRepo.delete({ product: product })
    }
    return await this.repo.delete(id)
  }
}
