import { useEffect, useState } from "react";
import LineChart from "./LineChart";
import "./style.scss";

function App() {
  const colors = ["#E87722","#6ECEB2","#FED141", "#f20089", "#ef233c", "#ffa6c1", "#5e548e"];

  const [rows, setRows] = useState(21);
  const [datasets, setDatasets] = useState(3);
  const [datas, setDatas] = useState([]);
  const [labels, setLabels] = useState([]);
  const [intervalData, setIntervalData] = useState(false);
  const [intervalId, setIntervalId] = useState();

  const [maxTicks, setMaxTicks] = useState(5);

  const min = 0.9;
  const max = 1;
  
  useEffect(() => {

    document.title = 'Hexagon Intern Task | 7r4nquocbao';

    calcTicksResponsive(document.body.clientWidth);
    setDatas(generateDatas(rows, datasets));
    setLabels(generateLabels(rows));
  }, []);

  useEffect(() => {
    if(intervalData) {
      let interval = setInterval(() => addData(), 1000);
      setIntervalId(interval);
    } else {
      clearInterval(intervalId);
    }
  }, [intervalData]);

  const calcTicksResponsive = (size) => {
    if(size < 576) {
      setMaxTicks(1);
    } else if(size >= 576 && size < 768) {
      setMaxTicks(2);
    } else if(size >= 768 && size < 992) {
      setMaxTicks(3);
    } else if(size >= 992 && size < 1200) {
      setMaxTicks(4);
    } else {
      setMaxTicks(5);
    }
  }

  window.addEventListener('resize', () => calcTicksResponsive(document.body.clientWidth));

  const hexToRgba = (hex, opacity) => {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if(result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      } else {
          return null;
      } 
  }

  const generateDatas = (rs, ds) => {
    let collection = [];

      for (let i = 0; i < ds; i++) {
          let dataset = [];
          for (let j = 0; j < rs; j++) {
            const randomValue = Math.random() * (max - min) + min;
            dataset.push(randomValue.toFixed(2));
          }
          collection.push(dataset);
      }
      return collection;
  }
  
  const generateLabels = (rs) => {
      let dates = [];
      for (let index = 0; index < rs; index++) {
          const today = new Date();
          let dayBefore = new Date(today);
          dayBefore.setDate(today.getDate() - index);
          dates.push(dayBefore.toLocaleDateString());
      }
      return dates.reverse();
  }

  const dataRow = () => {
    const randomValue = Math.random() * (max - min) + min;
    let latestDate;
    if(labels.length > 0) {
      latestDate = new Date(labels[labels.length - 1]);
    } else {
      latestDate = new Date();
    }
    latestDate.setDate(latestDate.getDate() + 1);
    return {
      date: latestDate.toLocaleDateString(),
      value: randomValue
    }
  }

  const addData = () => {
    datas.map(item => {
      let row1 = dataRow();
      item.push(row1.value.toFixed(2));
    });

    const row2 = dataRow();
    labels.push(row2.date);

    setLabels([...labels]);
    setDatas([...datas]);
    setRows(rows + 1);
  }

  const removeData = () => {
    datas.map(element => {
      element.pop();
    });

    labels.pop();

    setDatas([...datas]);
    setLabels([...labels]);
    setRows(rows > 0 ? rows - 1 : 0);
  }

  return (
    <div className="App container">

      <div className="title">
        <p>Tra cứu giá đơn vị</p>
        <div id="div-truncate" style={{lineHeight: '24px'}}>Nhằm cung cấp cho bạn đầy đủ thông tin về giá trị quỹ trong cả hiện tại và quá khứ, bạn có thể tùy chọn thời điểm tra cứu theo khung thời gian bạn muốn</div>
      </div>

      <div className="chart-element">
        <div className="chart-controller row g-0">

          <div className="col-md-10 control-side">
            <div className="fund-filter">
              <p>Tất cả các quỹ</p>
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 0L9.87666 5.62997L8 7.5L6.12334 5.62997L0.5 -6.55671e-07L15.5 0Z" fill="#0A3B32"/>
              </svg>
            </div>

            <div className="date-range-filter">
              <p>{`${labels[0]} - ${labels[labels.length - 1]}`}</p>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66667 7.22217H3.11111V8.77772H4.66667V7.22217ZM7.77778 7.22217H6.22222V8.77772H7.77778V7.22217ZM10.8889 7.22217H9.33333V8.77772H10.8889V7.22217ZM12.4444 1.77772H11.6667V0.222168H10.1111V1.77772H3.88889V0.222168H2.33333V1.77772H1.55556C0.692222 1.77772 0.00777777 2.47772 0.00777777 3.33328L0 14.2222C0 15.0777 0.692222 15.7777 1.55556 15.7777H12.4444C13.3 15.7777 14 15.0777 14 14.2222V3.33328C14 2.47772 13.3 1.77772 12.4444 1.77772ZM12.4444 14.2222H1.55556V5.66661H12.4444V14.2222Z" fill="#0A3B32"/>
              </svg>
            </div>

            <div className="button-filter">
              <p>Tra cứu</p>
            </div>
          </div>
          
          <div className="col-md-2 symbol-side">
            <div className="symbol-filter">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.427 16.3413H11.2799C10.8491 16.3413 10.5 16.6905 10.5 17.1212V27.2205C10.5 27.6513 10.8491 28.0004 11.2799 28.0004H16.427C16.8578 28.0004 17.2069 27.6513 17.2069 27.2205V17.1212C17.2069 16.6905 16.8578 16.3413 16.427 16.3413ZM15.6471 26.4407H12.0598V17.9011H15.6471V26.4407Z" fill="#E87722"/>
                <path d="M26.642 10.218H21.4559C21.0251 10.218 20.676 10.5672 20.676 10.9979V27.2193C20.676 27.65 21.0251 27.9992 21.4559 27.9992H26.642C27.0728 27.9992 27.4219 27.65 27.4219 27.2193V10.9979C27.4219 10.5672 27.0728 10.218 26.642 10.218ZM25.8622 26.4394H22.2357V11.7778H25.8622V26.4394Z" fill="#E87722"/>
                <path d="M6.24798 20.1229H1.0618C0.631071 20.1229 0.281921 20.4721 0.281921 20.9028V27.2198C0.281921 27.6505 0.631071 27.9997 1.0618 27.9997H6.24798C6.67871 27.9997 7.02786 27.6505 7.02786 27.2198V20.9028C7.02786 20.4721 6.67871 20.1229 6.24798 20.1229ZM5.46811 26.4399H1.84167V21.6827H5.46811V26.4399Z" fill="#E87722"/>
                <path d="M27.4997 0.782104C27.3811 0.61865 27.1945 0.51819 26.9928 0.509159L19.8959 0.00222826C19.4652 -0.0300893 19.0898 0.292937 19.0575 0.723589C19.0252 1.15432 19.3482 1.52966 19.7789 1.56198L24.8017 1.90307L15.5676 9.12683L8.50976 3.5897C8.20838 3.35101 7.7781 3.36758 7.4959 3.62866L0.243104 10.5695C-0.0652185 10.862 -0.0825342 11.3476 0.204144 11.6613C0.343266 11.8419 0.561354 11.9437 0.78907 11.9343C0.994768 11.9314 1.19099 11.8472 1.33496 11.7003L8.0809 5.2273L15.0607 10.7254C15.3456 10.9535 15.7507 10.9535 16.0356 10.7254L26.0181 2.95738L25.628 7.80099C25.626 8.22447 25.9474 8.57952 26.3689 8.61982H26.4079C26.8099 8.62184 27.1475 8.31792 27.1877 7.91794L27.6947 1.32799C27.7233 1.12506 27.6504 0.921002 27.4997 0.782104Z" fill="#E87722"/>
              </svg>
              <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.2647 28H3.03782C1.36337 28 0 26.691 0 25.0833V2.91667C0 1.309 1.36337 0 3.03782 0H21.2647C22.9392 0 24.3025 1.309 24.3025 2.91667V25.0833C24.3025 26.691 22.9392 28 21.2647 28ZM3.03782 1.16667C2.03291 1.16667 1.21513 1.95183 1.21513 2.91667V25.0833C1.21513 26.0482 2.03291 26.8333 3.03782 26.8333H21.2647C22.2696 26.8333 23.0874 26.0482 23.0874 25.0833V2.91667C23.0874 1.95183 22.2696 1.16667 21.2647 1.16667H3.03782Z" fill="#0A3B32"/>
                <path d="M20.0487 24.4992H4.25209C3.91672 24.4992 3.64453 24.2378 3.64453 23.9158V9.91585C3.64453 9.59385 3.91672 9.33252 4.25209 9.33252H20.0487C20.3841 9.33252 20.6563 9.59385 20.6563 9.91585V23.9158C20.6563 24.2378 20.3841 24.4992 20.0487 24.4992ZM4.85966 23.3325H19.4412V10.4992H4.85966V23.3325Z" fill="#0A3B32"/>
                <path d="M9.1154 24.4992C8.78001 24.4992 8.50781 24.2378 8.50781 23.9158V9.91585C8.50781 9.59385 8.78001 9.33252 9.1154 9.33252C9.45078 9.33252 9.72298 9.59385 9.72298 9.91585V23.9158C9.72298 24.2378 9.45078 24.4992 9.1154 24.4992Z" fill="#0A3B32"/>
                <path d="M20.0487 13.9996H4.25209C3.91672 13.9996 3.64453 13.7383 3.64453 13.4163C3.64453 13.0943 3.91672 12.833 4.25209 12.833H20.0487C20.3841 12.833 20.6563 13.0943 20.6563 13.4163C20.6563 13.7383 20.3841 13.9996 20.0487 13.9996Z" fill="#0A3B32"/>
                <path d="M20.0487 17.4991H4.25209C3.91672 17.4991 3.64453 17.2378 3.64453 16.9158C3.64453 16.5938 3.91672 16.3325 4.25209 16.3325H20.0487C20.3841 16.3325 20.6563 16.5938 20.6563 16.9158C20.6563 17.2378 20.3841 17.4991 20.0487 17.4991Z" fill="#0A3B32"/>
                <path d="M20.0487 20.9992H4.25209C3.91672 20.9992 3.64453 20.7378 3.64453 20.4159C3.64453 20.0939 3.91672 19.8325 4.25209 19.8325H20.0487C20.3841 19.8325 20.6563 20.0939 20.6563 20.4159C20.6563 20.7378 20.3841 20.9992 20.0487 20.9992Z" fill="#0A3B32"/>
              </svg>
            </div>
          </div>

        </div>
        <LineChart labels={labels} datas={datas} colors={colors} ticks={maxTicks}/>
      </div>

      <div className="data-controller">
        <button className={`btn btn-primary ${intervalData ? 'disabled' : ''}`} onClick={() => addData()}>Add Data</button>
        <button className={`btn btn-danger ${intervalData ? 'disabled' : ''}`} onClick={() => removeData()}>Remove Data</button>
        <button className={`btn ${intervalData ? 'btn-danger' : 'btn-success'}`} onClick={() => setIntervalData(!intervalData)}>
          {intervalData ? <div class="loader"></div> : ''}
          {intervalData ? 'Stop' : 'Add Data Interval'}
        </button>
      </div>
    </div>
  );
}

export default App;
