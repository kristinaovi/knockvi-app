import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "react-data-table-component";
import { H5 } from "../../../AbstractElements";
import useInvoices from "../../../Hooks/useInvoices";

const InvoiceList = () => {
  const { fetchAll } = useInvoices(); // gunakan fetchAll dari hook
  const [invoices, setInvoices] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Load data dari API saat komponen pertama kali di-render
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await fetchAll(); // ambil data dari API /invoices
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };
    fetchInvoices();
  }, [fetchAll]);

  const filteredData = invoices.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader className="card-no-border">
        <div className="d-flex justify-content-between align-items-center w-100">
          <H5>Invoice List</H5>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <DataTable
          columns={[
            { name: "Invoice Number", selector: (row) => row.invoice_number, sortable: true },
            { name: "Customer", selector: (row) => row.customer, sortable: true },
            { name: "ETD NKB", selector: (row) => row.etd_nkb, sortable: true },
            { name: "ETA Customer", selector: (row) => row.eta_customer, sortable: true },
            { name: "Ship Method", selector: (row) => row.ship_method, sortable: true },
          ]}
          data={filteredData}
          striped
          center
          pagination
        />
      </CardBody>
    </Card>
  );
};

export default InvoiceList;
