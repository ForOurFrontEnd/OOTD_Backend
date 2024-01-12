import { Body, Controller, Get, Header, Headers, Req, Res } from '@nestjs/common';
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
        res.send(itemData)
    }
}
