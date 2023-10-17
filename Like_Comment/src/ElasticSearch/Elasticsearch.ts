import { Client } from "@elastic/elasticsearch";
import axios from "axios";
import { HOST_ADRESS } from "../Config/Config";
class ElasticsearchService {
    public esClient: Client;

    constructor() {
        this.esClient = new Client({ node: `http://${HOST_ADRESS}:9200` });
    }

    public async connect() {
        try {
            // Gửi một HTTP GET request đến Elasticsearch để kiểm tra kết nối
            const ElasticSearch = await axios.get(`http://${HOST_ADRESS}:5601`);
            const Kibana = await axios.get(`http://${HOST_ADRESS}:9200`);
            // Kiểm tra mã trạng thái HTTP, 200 là thành công
            if (ElasticSearch.status === 200 && Kibana.status === 200) {
                console.log('Connect success to Elasticsearch & Kibana');
            } else {
                console.error('Connect fail to Elasticsearch & Kibana');
            }
        } catch (error: any) {
            console.error('Something went wrong !:', error.message);
        }
    }
}

export {
    ElasticsearchService
}
