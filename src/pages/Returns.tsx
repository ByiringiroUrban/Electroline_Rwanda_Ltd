
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Calendar, Shield } from "lucide-react";
import Header from "@/components/Header";

const Returns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-slate-600 text-lg">
            Your satisfaction is our priority
          </p>
        </div>

        <div className="space-y-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-violet-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  We offer a 30-day return policy for all items in their original condition.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Items must be unworn and in original packaging</li>
                  <li>• Tags must be attached</li>
                  <li>• Original receipt or order confirmation required</li>
                  <li>• Custom items are not eligible for return</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="mr-2 h-5 w-5 text-violet-600" />
                How to Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-slate-600">
                <p>1. Contact our customer service team</p>
                <p>2. Receive return authorization and shipping label</p>
                <p>3. Package items securely</p>
                <p>4. Drop off at designated location or schedule pickup</p>
                <p>5. Refund processed within 5-7 business days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Returns;
