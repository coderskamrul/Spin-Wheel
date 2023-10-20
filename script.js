const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("results");
const disBnt = document.getElementById("btnDis");
const textBox = document.getElementById("text-box");
const textBtn = document.getElementById("text-btn");

//Names list adding
let names = [], testName="", nameSize;
textBtn.addEventListener("click", function(e) {
     // e.preventDefault();
    let tempValue = textBox.value;
    let names = tempValue.split("\n");
    let showName = [" ", "kamrul","hasan","emrul", "nazmul", "sharif"]

      //Size of each piece
      const data_size = [];
      for(let d = 0; d < names.length; d++){
          data_size.push(16);
      }

      //Object that stores values of minimum and maximum angle for a value
      let minArr = [];
      let maxArr = [];
      let valArr = [];
      //dynamic min max val
      let per_val = 360 / data_size.length;
      let per_min = 0, per_max = per_val;
      for(let j = 1; j <= data_size.length; j++){
          minArr.push(per_min);
          maxArr.push(per_max);
          valArr.push(j);
          per_min = per_max + 1;
          per_max += per_val;
      }
      console.log(valArr)


      let rotationValues = [];
      for(let i = 0; i < data_size.length; i++){
          rotationValues.push({ 'minDegree' : minArr[i] , 'maxDegree': maxArr[i], 'value' : valArr[i] });
      }


      //background color for each piece 
      var pieColors = [];
      for(let c = 0; c < data_size.length; c++){
          let ucolor = (Math.random() * 0xfffff * 1000000).toString(16);
          pieColors.push('#' + ucolor.slice(0, 6));
      }

      //create  lebel list for chart
      let oneFirstSide = data_size.length / 4;
      let lebelvalues = [], lebelNum = [];
      lebelvalues = names;
      for(let k = oneFirstSide; k > 0 ; k--){lebelNum.push(Math.ceil(k));}
      for(let l = data_size.length; l > oneFirstSide ; l--){lebelNum.push(Math.ceil(l));}
      
      console.log(lebelvalues)
      //Name indexin start
      var FinalName = [];
      var obj = {};
      
      for (i = 0; i < lebelNum.length; i++) {
        obj[lebelNum[i]] = names[i];
      }
      FinalName.push(obj);
      console.log(FinalName[0]);
      //Name indexin end
      // console.log(lebelvalues)

      //Create chart

      var cghartVal = Chart.getChart("wheel");
      if(cghartVal){
          cghartVal.destroy();
      }

      let myChart = new Chart(wheel, {

        //Plugin for displaying text on pie chart
        plugins: [ChartDataLabels],
        //Chart Type Pie
        type: "pie",
        data: {
          //Labels(values which are to be displayed on chart)
          labels: lebelvalues,

          //Settings for dataset/pie
          datasets: [
            {
              backgroundColor: pieColors,
              data: data_size,
            },
          ],
        },
        options: {
          //Responsive chart
          responsive: true,
          animation: { duration: 0 },
          plugins: {
            //hide tooltip and legend
            tooltip: false,
            legend: {
              display: false,
            },
            //display labels inside pie chart
            datalabels: {
              color: "#ffffff",
              formatter: (_, context) => context.chart.data.labels[context.dataIndex],
              font: { size: 24 },
            },
          },
        },
      
      });

      //display value based on the randomAngle
      const valueGenerator = (angleValue) => {
        for (let i of rotationValues) {
          //if the angleValue is between min and max then display it
          if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
            finalValue.innerHTML = `<p> ${FinalName[0][i.value]} is Winner!</p>`;
            spinBtn.disabled = false;
            break;
          }
        }
      };

      //Spinner count
      let count = 0;
      //100 rotations for animation and last rotation for result
      let resultValue = 101;
      //Start spinning
      spinBtn.addEventListener("click", () => {
        spinBtn.disabled = true;
        //Empty final value
        finalValue.innerHTML = `<p>Good Luck!</p>`;
        //Generate random degrees to stop at
        let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
        //Interval for rotation animation
        let rotationInterval = window.setInterval(() => {
          //Set rotation for piechart
          /*
          Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
          */
          myChart.options.rotation = myChart.options.rotation + resultValue;
          //Update chart with new value;
          myChart.update();
          //If rotation>360 reset it back to 0
          if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
          } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
          }
          // console.log("randomDegree " + randomDegree);
          // console.log("rotationInterval " + rotationInterval);
        }, 10);
      });
      textBox.value="";
      disBnt.classList.add("disableicon")
});








 