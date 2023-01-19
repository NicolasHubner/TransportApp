import { getRealmContext } from "../contexts/RealmContext";

export class Dao {
    static tableName = "";

    static async getContext() {
        return await getRealmContext();
    }
    
    static async save(){
    }

    static async getAll() {
        const realmContext = await this.getContext();
        const result = realmContext.objects(this.tableName);
        return result;
    }

    static async getTop(top) {
        const realmContext = await this.getContext();
        const result =  realmContext.objects(this.tableName).slice(0,top);
        return result;
    }

    static async deleteList(list) {
        const realmContext = await this.getContext();
        realmContext.write(() => {
            realmContext.delete(list);
        });
    }

    static async deleteAll() {
        const realmContext = await this.getContext();
        realmContext.write(() => { 
            const list = realmContext.objects(this.tableName);
            realmContext.delete(list);
        });
    }

    static async findById(id) {
        const realmContext = await this.getContext();
        return realmContext.objectForPrimaryKey(this.tableName, id);
    }
}