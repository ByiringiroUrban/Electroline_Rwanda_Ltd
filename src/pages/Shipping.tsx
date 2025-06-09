
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, MapPin } from "lucide-react";
import Header from "@/components/Header";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Shipping Information
          </h1>
          <p className="text-slate-600 text-lg">
            Fast and reliable delivery across Rwanda
          </p>
        </div>

        <div className="space-y-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-violet-600" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Standard Delivery</h3>
                  <p className="text-slate-600 mb-2">3-5 business days</p>
                  <p className="text-sm text-slate-500">Free for orders over RWF 50,000</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Express Delivery</h3>
                  <p className="text-slate-600 mb-2">1-2 business days</p>
                  <p className="text-sm text-slate-500">RWF 5,000 delivery fee</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-violet-600" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-600">
                <li>• Kigali City - Same day delivery available</li>
                <li>• Eastern Province - 2-3 business days</li>
                <li>• Western Province - 2-3 business days</li>
                <li>• Northern Province - 3-4 business days</li>
                <li>• Southern Province - 3-4 business days</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
