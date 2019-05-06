
import d3 from 'd3-selection';
import d3Scale from 'd3-scale';
import d3Arr from 'd3-array';
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
                                    k.startsWith("20")||
                                    k.startsWith("Indicator Name")
                                )
                            .reduce((obj,key)=>{obj[key]=r[key];return obj},{})
                        );
    
    let subGroupData = csvRows.map(r=>{
        
        let objArr = Object.entries(r).filter(e=>e[0]!="Indicator Name")
        let arr = objArr.map(e=>parseFloat(e[1]||0))
        let scaleFunc = d3Scale.scaleLinear()
                        .domain([d3Arr.min(arr),d3Arr.max(arr)])
                        .range([10,600]);
        return {"key":r["Indicator Name"],"values":objArr.map(e=>[...e,scaleFunc])};
    })
    
    let groups = d3.select("#content").append("svg")
        .attr("width", 800)
        .attr("height", 4600)
        .selectAll("g")
        .data(subGroupData)
        .enter()
        .append("g")
        .attr("transform",(d,i)=>`translate(10,${i*300+50})`);

    console.log(groups);

    groups.append("text")
          .text(d=>d.key)
          .style("fill","#000")
          .style("font-weight","bold");

    let subgroups = groups.selectAll("rect")
        .data(d=>d.values)
        .enter().append("g")
        .attr("transform",(d,i)=>`translate(50,${i*14+15})`);
    
    subgroups.append("text")
             .style("fill","black")
             .text(d=>d[0])
             .attr("transform",`translate(0,10)`);
                    
    subgroups.append("rect")
        .attr("transform",`translate(50,0)`)
        // .attr("width", d => `${parseFloat((d[1]||10))*10}`)
        .attr("width",d=>d[2](d[1]))
        .attr("height", d => "10px")
        .style("fill", "cyan");
    
    subgroups.append("text")
        .style("fill","black")
        .text(d=>(+d[1]).toFixed(2))
        .attr("transform",`translate(670,10)`);
}

main();