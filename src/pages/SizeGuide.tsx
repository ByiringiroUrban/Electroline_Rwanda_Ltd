import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Plug } from "lucide-react"; // Changed icon imports
import Header from "@/components/Header";

const ElectricalSpecs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Product Specifications Guide
          </h1>
          <p className="text-slate-600 text-lg">
            Compare technical details and find the right product for your needs
          </p>
        </div>

        <div className="space-y-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-violet-600" />
                Power Supplies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Input Voltage (V)</TableHead>
                    <TableHead>Output Power (W)</TableHead>
                    <TableHead>Efficiency (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>PS-100</TableCell>
                    <TableCell>100-240</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>85</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PS-250</TableCell>
                    <TableCell>100-240</TableCell>
                    <TableCell>750</TableCell>
                    <TableCell>88</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PS-500</TableCell>
                    <TableCell>100-240</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>90</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PS-750</TableCell>
                    <TableCell>100-240</TableCell>
                    <TableCell>1500</TableCell>
                    <TableCell>92</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plug className="mr-2 h-5 w-5 text-violet-600" />
                Cables & Connectors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Length (m)</TableHead>
                    <TableHead>Connector A</TableHead>
                    <TableHead>Connector B</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>HDMI 2.1</TableCell>
                    <TableCell>1.5</TableCell>
                    <TableCell>Male</TableCell>
                    <TableCell>Male</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>USB-C</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Male</TableCell>
                    <TableCell>Male</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ethernet Cat6</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>RJ45</TableCell>
                    <TableCell>RJ45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Power Cord</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>Type G</TableCell>
                    <TableCell>IEC C13</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElectricalSpecs;