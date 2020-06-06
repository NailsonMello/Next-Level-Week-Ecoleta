import { Request, Response } from 'express'
import Knex from '../database/connection'

//to use mysql use the connection below
//import Knex from '../database/connectionMySQL'

class ItemsController {
    async Index(req: Request, res: Response) {
        const items = await Knex('items').select('*')
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://10.0.0.109:3333/uploads/${item.image}`
            }
        })
        res.json(serializedItems)
    }
}

export default ItemsController