import { Injectable } from "@nestjs/common";
import { Item } from "../item/entity/item.entity";
import { Like, Repository } from "typeorm";
import { Search } from "./entity/search.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { InjectRepository } from "@nestjs/typeorm";

type Buyer = SocialBuyer | LocalBuyer;

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Search)
    private readonly searchRepository: Repository<Search>
  ) {}

  async searchItems(param: string): Promise<Item[]> {
    return await this.itemRepository.find({
      where: {
        title: Like(`%${param}%`),
      },
    });
  }

  async addSearchHistory(buyer: Buyer, keyword: string): Promise<void> {
    const search = new Search();
    search.keyword = keyword;

    if (buyer instanceof SocialBuyer) {
      search.socialBuyer = buyer;
    } else if (buyer instanceof LocalBuyer) {
      search.localBuyer = buyer;
    }

    await this.searchRepository.save(search);
  }

  async getSearchHistory(buyer: Buyer, limit: number = 10): Promise<string[]> {
    const whereConditions: Record<string, any> = {};
    whereConditions[
      buyer instanceof SocialBuyer ? "socialBuyer" : "localBuyer"
    ] = buyer;

    const recentSearches = await this.searchRepository.find({
      where: whereConditions,
      order: { createdAt: "DESC" },
      take: limit,
    });

    return recentSearches.map((history) => history.keyword);
  }

  public parseBuyerType(buyerType: string): SocialBuyer | LocalBuyer {
    return buyerType === "social"
      ? new SocialBuyer()
      : buyerType === "local"
        ? new LocalBuyer()
        : null;
  }
}
