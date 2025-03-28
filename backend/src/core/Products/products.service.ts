import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Category } from "../categories/categorie.entity"
import { Repository } from "typeorm"
import { Product } from "./products.entity"

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Category) private repo: Repository<Product>) {}
}