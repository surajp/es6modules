
import d3 from 'd3-selection';
import CSVParse from './csv.mjs';

/* d3.select("#content").append("svg")
    .attr("width", 800)
    .attr("height", 800)
    .selectAll("g")
    .data([1, 2, 3])
    .enter()
    .append("g")
    .append("circle")
    .attr("cx", d => 100 * d)
    .attr("cy", d => 100 * d)
    .attr("r", d => 50 * d)
    .style("fill", d => ["purple", "green", "yellow"][d - 1]);
*/

async function main(){

    let csvRows = (await new CSVParse().doParse())
                    .filter(r=>r["Indicator Name"].trim()
                    .startsWith("Labor force participation"))
                    .map(r=>Object.keys(r)
                            .filter(k=>
                                    k.startsWith("19")||
                                    k.startsWith("20")||
                                    k.startsWith("Indicator Name")
                                )
                            .reduce((obj,key)=>{obj[key]=r[key];return obj},{}));
    
    let groups = d3.select("#content").append("svg")
        .attr("width", 800)
        .attr("height", 7500)
        .selectAll("g")
        .data(csvRows)
        .enter()
        .append("g")
        .attr("transform",(d,i)=>`translate(10,${i*500})`);

    console.log(groups);

    groups.append("text")
          .text(d=>d["Indicator Name"])
          .style("fill","#000")

    groups.selectAll("rect")
        .data(d=>Object.values(d).filter(r=>!r.toLowerCase().startsWith("labor force")))
        .enter()                         
        .append("rect")
        .attr("width", d => `${parseFloat((d||10))*10}`)
        .attr("height", d => "3px")
        .attr("transform",(d,i)=>`translate(50,${i*8+15})`)
        .style("fill", "cyan");
}

main();