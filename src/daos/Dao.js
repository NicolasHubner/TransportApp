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

    static async delete(id) {
        const realmContext = await this.getContext();
        realmContext.write(() => { 
            const obj = realmContext.objectForPrimaryKey(this.tableName, id);
            console.log("delete obj: ",obj);
            if(obj)
                realmContext.delete(obj);
        });
    }

    static async findById(id) {
        const realmContext = await this.getContext();
        return realmContext.objectForPrimaryKey(this.tableName, id);
    }

    static generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}