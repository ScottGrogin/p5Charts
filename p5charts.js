const _fract = Symbol('fract');
const _total = Symbol('total');

class Chart{
   constructor(dataLabel, x, y, size, title, fontSize){
        this.dataLabel = dataLabel;
        this.x = x;
        this.y = y;
        this.size = size;
        this.title = title;
        this.fontSize = fontSize;
        
    }
    
    [_fract](value){
        return (value - floor(value));
    }
    
    [_total](dataLabel){
        let total = 0;
        for(let i = 0; i < dataLabel.length; i++){
            total += dataLabel[i].value;
        }
        return total;
        
    }
    BarGraph(scale, sideLabel){
        textAlign(RIGHT);
        textSize(this.fontSize);
        rect(this.x,this.y,this.size,this.size);
        let max = this.dataLabel[0].value;
        for(let i=0;i<this.dataLabel.length;i++){
            if(this.dataLabel[i].value > max){
                max = this.dataLabel[i].value; 
            }
        }
        
       for(let i =1, j = 1; i <= max; i+=scale,j+=2){
           if(-j*this.fontSize  + (this.y+this.size)  > this.y){
            text( i,this.x, -j*this.fontSize + (this.y+this.size)  );   
           }
       }
    }
    
    Title(title, x, y) {
        textAlign(CENTER, TOP);
        text(title,x,y);
    }
    
    Legend(x, y, colorLabel, fontSize) {
        textAlign(LEFT, CENTER);
        textSize(fontSize);
        for (let i =0; i < colorLabel.length;i++){
            fill(colorLabel[i].color);
            ellipse(x,y+(i*20),10,10);
            fill(0);
            text(colorLabel[i].label,x+10,y+(i*20) );

        }
    }
    
    PieChart(defaultTitle = true, defaultLegend = true, labelsAtPercents= false, showLines = true){
        let arcLocation = 0, total = 0, percents = [], colors = [];
        
        //Get total for percentages
        for(let i = 0; i < this.dataLabel.length; i++){
            total += this.dataLabel[i].value;
        }
        //calculate percentages
        for(let i = 0; i< this.dataLabel.length; i++){0
                                            
            percents.push({"value":100*(this.dataLabel[i].value/total), "label":this.dataLabel[i].label});
        }
       
        //Putting array in order if greatest fractional value
        let swapped;
        do {
            swapped = false;
            for (let i=0; i < percents.length-1; i++) {
                if (this[_fract](percents[i].value) <this[ _fract](percents[i+1].value)) {
                    let temp = percents[i];
                    percents[i] = percents[i+1];
                    percents[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        
        //flooring percents
        for(let i =0; i< percents.length;i++){
            percents[i].value = floor(percents[i].value);
        }
        
        //calculating percents array total to fix numbers that dont add up to 100%
        let sum =0;
        for(let i=0;i<percents.length;i++){
            sum += percents[i].value;
        }
        
        
        //Distributing difference across array
        for(let i = 0, diff= 100 - sum; diff>0 ; i++,diff--) {   
            percents[i].value+=1;
        }
        
        for(let i = 0, diff= 100 - sum; diff<0 ; i++,diff++) {
            
            percents[i].value-=1;
        }
        
            
        
        //putting percents in regular sorted order
        let swapped2;
        do {
            swapped2 = false;
            for (let i=0; i < percents.length-1; i++) {
                if ((percents[i].value) > (percents[i+1].value)) {
                    let temp = percents[i];
                    percents[i] = percents[i+1];
                    percents[i+1] = temp;
                    swapped2 = true;
                }
            }
        } while (swapped2);
        //Display chart
        colorMode(HSB, 360, 100, 100);
        textSize(this.fontSize);
   
    
        for (var i =0; i < percents.length; i++) {
        
            textAlign(CENTER, CENTER);
            
            fill(arcLocation,72,74);
						colors.push({"color":color(arcLocation,74,72),"label":percents[i].label});
        
            noStroke();
            arc(this.x,this.y,this.size,this.size,radians(arcLocation),radians(arcLocation + (360*(percents[i].value/100))));
        
        
            fill(0,0,0);
        
          
            if(percents[i].value > 0){
                  if(!labelsAtPercents){
                     text(((percents[i].value)) + "%" , this.x + (this.size/1.5)*cos(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )), this.y + (this.size/1.5)*sin(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )));
                  } else {
                       text(((percents[i].label+ " " +percents[i].value)) + "%" , this.x + (this.size/1.5)*cos(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )), this.y + (this.size/1.5)*sin(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )));
                      
                  }
                stroke(0);
                if(showLines){
                	line(this.x + (this.size/2.1)*cos(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )), this.y + (this.size/2.1)*sin(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )),this.x + (this.size/1.7)*cos(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )), this.y + (this.size/1.7)*sin(radians((arcLocation +(arcLocation +360*(percents[i].value/100) ))/2 )));
								}
            }
        
            arcLocation += (360*(percents[i].value/100));
        
        }
        if(defaultTitle){
            this.Title(this.title,this.x,5);
        }
			if(defaultLegend){
				this.Legend(this.x + this.size,this.y - (this.size/2),colors,this.fontSize);
			}
        return colors;
    }
    
    
    
}

