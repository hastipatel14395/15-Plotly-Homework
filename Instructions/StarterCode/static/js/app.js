// 1. Use the D3 library to read in samples.json.

// Initialize Page
function init() {
    d3.json("samples.json").then((data)=> {

        // Add data to dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        var menuNames = data.names;
        menuNames.forEach((name)=> {
            var menuName = dropdownMenu.append("option")
                            .attr("value", name)
                            .text(name);
        })

        // 2. Create a horizontal bar chart with a dropdown menu to display 
        // the top 10 OTUs found in that individual.

        // Use sample_values as the values for the bar chart.
        var values = data.samples[0].sample_values;
        // Use otu_ids as the labels for the bar chart.
        var labels = data.samples[0].otu_ids;
        // Use otu_labels as the hovertext for the chart.
        var hovertext = data.samples[0].otu_labels;

        var top10Values = values.slice(0,10).reverse();
        var top10Labels = labels.slice(0,10).reverse();
        var top10Hovertext = hovertext.slice(0,10).reverse();

        var barChartDiv = d3.select("#bar");

        var trace1 ={
            y: top10Labels.map(object => "OTU "+ object),
            x: top10Values,
            text: top10Hovertext,
            type: "bar",
            orientation: "h"

        };

        var layout = {
            margin: {
              t: 20,
              b: 20
            }
          };

        var barChartData = [trace1]

        Plotly.newPlot("bar", barChartData, layout);

        // 3. Create a bubble chart that displays each sample.
        var trace2 = {
            // Use otu_ids for the x values.
            x: labels,
            // Use sample_values for the y values.
            y: values,
            // Use otu_labels for the text values.
            text: hovertext,
            mode: 'markers',
            marker: {
                // Use sample_values for the marker size.
                size: values,
                // Use otu_ids for the marker colors.
                color: labels,
            }
        }

        var bubblePlotData = [trace2];

        Plotly.newPlot('bubble', bubblePlotData);

        // 4. Display the sample metadata, 
        // i.e., an individual's demographic information.
        var sampleMetadata = d3.select("#sample-metadata");
        var firstName = data.metadata[0];

        // 5. Display each key-value pair from the metadata JSON object 
        // somewhere on the page.   
        Object.entries(firstName).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);
        })

      });
    
}

// 6. Update all of the plots any time that a new sample is selected.
// Update plots and metadata for newly selected value
function optionChanged(selectValue){
    d3.json("samples.json").then((data)=> {
        // Filter data by matching id for samples to the selectValue
        var samples = data.samples;

        var filteredSample = samples.filter(sample => sample.id === selectValue);
        
        // Update values for barchart

        var values = filteredSample[0].sample_values;
        // Use otu_ids as the labels for the bar chart.
        var labels = filteredSample[0].otu_ids;
        // Use otu_labels as the hovertext for the chart.
        var hovertext = filteredSample[0].otu_labels;

        var top10Values = values.slice(0,10).reverse();
        var top10Labels = labels.slice(0,10).reverse();
        var top10Hovertext = hovertext.slice(0,10).reverse();

        var barChartDiv = d3.select("#bar");

        // Use restlye to update bar chart
        Plotly.restyle("bar", "y", [top10Labels.map(object => "OTU "+ object)]);
        Plotly.restyle("bar", "x", [top10Values]);
        Plotly.restyle("bar", "text", [top10Hovertext]);

        // Update values for bubbleplot
        // Use restyle to update bubbleplot

        Plotly.restyle('bubble', "x", [labels]);
        Plotly.restyle('bubble', "y", [values]);
        Plotly.restyle('bubble', "size", [values]);
        Plotly.restyle('bubble', "text", [hovertext]);
        Plotly.restyle('bubble', "color", [labels]);
        
        // Build metadata based on the filter
        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
        var demographics = data.metadata;
        var filteredMetaData = demographics.filter(sample => sample.id === parseInt(selectValue));

        // Display each key-value pair from the metadata JSON object 
        // somewhere on the page.   
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);
        })

        var gaugeValue = filteredMetaData[0].wfreq;
        
        Plotly.restyle('gauge', "value", [gaugeValue]);

    });
}
init();