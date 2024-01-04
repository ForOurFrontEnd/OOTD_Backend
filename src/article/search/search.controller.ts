import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("/:param")
  async searchItems(@Param("param") param: string) {
    const items = await this.searchService.searchItems(param);
    return { items };
  }

  @Post("/history")
  async addSearchHistory(
    @Body() data: { buyer: SocialBuyer | LocalBuyer; keyword: string }
  ) {
    const { buyer, keyword } = data;
    await this.searchService.addSearchHistory(buyer, keyword);
    return { success: true };
  }

  @Get("history/:buyer/:limit")
  async getSearchHistory(
    @Param("buyer") buyerType: string,
    @Param("limit") limit: number
  ) {
    const buyer = this.searchService.parseBuyerType(buyerType);
    const history = await this.searchService.getSearchHistory(buyer, +limit);
    return { history };
  }
}
