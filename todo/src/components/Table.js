import React, { useMemo } from "react";
import "../styles/Table.css";
import useLocalStorage from "../hooks/useLocalStorage";

const Table = ({ userId }) => {

  const { month, year, daysInMonth } = useMemo(() => {
    const d = new Date();
    return {
      month: d.toLocaleString("default", { month: "long" }),
      year: d.getFullYear(),
      daysInMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    };
  }, []);

  const [rows, setRows] = useLocalStorage(
    `monthlyTasks-${month}-${year}`,
    [],
    userId
  );

  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: Date.now(),
        taskName: "",
        days: Array(daysInMonth).fill(false)
      }
    ]);
  };

  const updateTaskName = (id, value) => {
    setRows(prev =>
      prev.map(r =>
        r.id === id ? { ...r, taskName: value } : r
      )
    );
  };

  const updateCell = (id, index, value) => {
    setRows(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              days: r.days.map((d, i) =>
                i === index ? value : d
              )
            }
          : r
      )
    );
  };

  const deleteRow = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="table-container">
      <h2>{month} {year}</h2>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>
                <input
                  value={row.taskName}
                  onChange={e =>
                    updateTaskName(row.id, e.target.value)
                  }
                />
              </td>

              {row.days.map((checked, i) => (
                <td key={i}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={e =>
                      updateCell(row.id, i, e.target.checked)
                    }
                  />
                </td>
              ))}

              <td>
                <button onClick={() => deleteRow(row.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow}>+ Add Row</button>
    </div>
  );
};

export default Table;
