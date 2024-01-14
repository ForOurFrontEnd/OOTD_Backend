import { Body, Controller, Get, Header, Headers, Post, Req, Res } from '@nestjs/common';
import { UserService } from 'src/member/user/user.service';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
    constructor(
        private readonly userService: UserService,
        private readonly itemService: ItemService
    ) { }

    @Get("view")
    async detailView(@Req() req, @Res() res) {
        const {item} = req.query;
        const itemData = await this.itemService.itemView(item);
        res.send(itemData)
    }

    @Get("categoryview")
    async detailCategoryView(@Req() req, @Res() res) {
        const {category} = req.query;
        const itemData = await this.itemService.categoryView(category);
        const page = Math.ceil(itemData.length / 20)
        const categoryData = {item:itemData, page:page}
        res.send(categoryData)
    }

    @Get("categorypage")
    async categoryPage(@Req() req, @Res() res) {
        const {category, page} = req.query;
        const itemData = await this.itemService.categoryPage(category,page);
        res.send(itemData)
    }
}
