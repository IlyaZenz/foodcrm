import { Injectable } from "@nestjs/common"
import { LimitOffsetDto } from "../../shared/dtos/limit-offset.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { DeleteResult, Repository } from "typeorm"
import { Banner } from "./banners.entity"
import { AddBannerDto } from "./dtos/add-banner.dto"
import { UpdateBannerDto } from "./dtos/update-banner.dto"
import slugify from "slugify"

@Injectable()
export class BannersService {
  constructor(@InjectRepository(Banner) private repo: Repository<Banner>,) {}

  async add(data: AddBannerDto): Promise<Banner> {
    let url = slugify(data.title, { lower: true, strict: true })
    const existBanner = await this.repo.findOneBy({ url })
    if (existBanner) {
      url = "${url}-${Date.now()}"
    }
    const newBanner = this.repo.create({ title: data.title, url })
    const savedBanner = await this.repo.save(newBanner)
    newBanner.sortOrder = newBanner.id
    return this.repo.save(savedBanner)
  }

  // async add2(data: AddBannerDto): Promise<Banner> {
  //   const item = new Banner()
  //   item.title = data.title
  //   item.url = slugify(data.title, { lower: true, strict: true })
  //
  //   if (await this.repo.findOneBy({ url: item.url }))
  //     item.url = item.url + Date.now()
  //
  //   return this.repo
  //     .save(item)
  //     .then((i) => this.repo.save({ ...item, sortOrder: i.id }))
  // }

  get(id: number): Promise<Banner> {
    return this.repo
      .createQueryBuilder("banner")
      .select(["banner.id", "banner.title", "banner.content", "banner.image"])
      .where({ id })
      .getOneOrFail()
  }

  getAll(query: LimitOffsetDto) {
    return this.repo
      .createQueryBuilder("banner")
      .select(["banner.id", "banner.title", "banner.sortOrder"])
      .orderBy("banner.sortOrder", "ASC")
      .take(query.limit)
      .skip(query.offset)
      .getMany()
  }

  async update(id: number, data: UpdateBannerDto): Promise<Banner> {
    const banner = await this.repo.findOneBy({ id: id })
    if (!banner) {
      throw new Error("Banner not found")
    }

    return await this.repo.save<Banner>({ ...banner, ...data })
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repo.delete(id)
  }
}
