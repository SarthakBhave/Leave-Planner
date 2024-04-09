import React, { useState, useEffect } from "react";

const LeavePlanner = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    new Date().getMonth()
  );
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    fetchDataFromCSV();
  }, [currentYear, currentMonthIndex]);

  const fetchDataFromCSV = async () => {
    try {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1_S62QVyd1rxdJOlcsyH9R4w2y8prDBLwp3JiDpiEalw/export?format=csv"
      );
      const text = await response.text();
      const data = text
        .trim()
        .split("\n")
        .map((row) => row.split(","));
      setLeaveData(data);
    } catch (error) {
      console.error("Error fetching data from CSV:", error);
    }
  };

  const updateMonth = (increment) => {
    setCurrentMonthIndex((prevIndex) => {
      let newIndex = prevIndex + increment;
      if (newIndex < 0) {
        newIndex = 11;
        setCurrentYear((prevYear) => prevYear - 1);
      } else if (newIndex > 11) {
        newIndex = 0;
        setCurrentYear((prevYear) => prevYear + 1);
      }
      return newIndex;
    });
  };

  const updateYear = (increment) => {
    setCurrentYear((prevYear) => prevYear + increment);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="container">
      <div className="table-container">
        <table id="leave-table">
          <thead>
            <tr id="year-header">
              <th
                colSpan="33"
                id="year-cell"
                style={{ backgroundColor: "antiquewhite" }}
              >
                <div
                  className="arrow left-arrow"
                  onClick={() => updateYear(-1)}
                >
                  &lt;
                </div>
                <span id="year-text" style={{ fontSize: "x-large" }}>
                  {currentYear}
                </span>
                <div
                  className="arrow right-arrow"
                  onClick={() => updateYear(1)}
                >
                  &gt;
                </div>
              </th>
            </tr>
            <tr>
              <th rowSpan="2" style={{ backgroundColor: "yellow" }}>
                Employee Name
              </th>
              <th
                colSpan="31"
                id="month-header"
                style={{ backgroundColor: "aqua" }}
              >
                <div
                  className="arrow left-arrow"
                  onClick={() => updateMonth(-1)}
                >
                  &lt;
                </div>
                <span id="month-text" style={{ fontSize: "x-large" }}>
                  {monthNames[currentMonthIndex]}
                </span>
                <div
                  className="arrow right-arrow"
                  onClick={() => updateMonth(1)}
                >
                  &gt;
                </div>
              </th>
            </tr>
            <tr id="date-row">
              {Array.from(
                {
                  length: new Date(
                    currentYear,
                    currentMonthIndex + 1,
                    0
                  ).getDate(),
                },
                (_, index) => (
                  <th
                    key={index + 1}
                    style={{
                      backgroundColor: isWeekend(
                        new Date(currentYear, currentMonthIndex, index + 1)
                      )
                        ? "grey"
                        : "inherit",
                    }}
                  >
                    {index + 1}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {leaveData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row[0]}</td>
                {Array.from(
                  {
                    length: new Date(
                      currentYear,
                      currentMonthIndex + 1,
                      0
                    ).getDate(),
                  },
                  (_, index) => {
                    const currentDate = index + 1;
                    const leaveFromDate = new Date(row[1]);
                    const leaveToDate = new Date(row[2]);
                    if (
                      leaveFromDate.getMonth() === currentMonthIndex &&
                      leaveFromDate.getFullYear() === currentYear &&
                      currentDate >= leaveFromDate.getDate() &&
                      currentDate <= leaveToDate.getDate()
                    ) {
                      return (
                        <td key={index}>
                          <div className={`leave-box ${row[3]}`}>{row[3]}</div>
                        </td>
                      );
                    } else {
                      return <td key={index}></td>;
                    }
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavePlanner;
