import d3 from 'd3-fetch';

class CsvParse{

    async doParse(){
        let rows = await d3.csv("../usa_data.csv");
        return rows;
    }
}

export default CsvParse;