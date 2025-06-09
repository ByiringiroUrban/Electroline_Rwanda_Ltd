
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ruler } from "lucide-react";
import Header from "@/components/Header";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Size Guide
          </h1>
          <p className="text-slate-600 text-lg">
            Find your perfect fit
          </p>
        </div>

        <div className="space-y-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="mr-2 h-5 w-5 text-violet-600" />
                Shoe Sizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rwanda Size</TableHead>
                    <TableHead>US Size</TableHead>
                    <TableHead>EU Size</TableHead>
                    <TableHead>Length (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>36</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>36</TableCell>
                    <TableCell>23</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>37</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>37</TableCell>
                    <TableCell>24</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>38</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>39</TableCell>
                    <TableCell>9</TableCell>
                    <TableCell>39</TableCell>
                    <TableCell>26</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Clothing Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (cm)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hip (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>S</TableCell>
                    <TableCell>86-91</TableCell>
                    <TableCell>71-76</TableCell>
                    <TableCell>91-96</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M</TableCell>
                    <TableCell>96-101</TableCell>
                    <TableCell>81-86</TableCell>
                    <TableCell>101-106</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L</TableCell>
                    <TableCell>106-111</TableCell>
                    <TableCell>91-96</TableCell>
                    <TableCell>111-116</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XL</TableCell>
                    <TableCell>116-121</TableCell>
                    <TableCell>101-106</TableCell>
                    <TableCell>121-126</TableCell>
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

export default SizeGuide;
