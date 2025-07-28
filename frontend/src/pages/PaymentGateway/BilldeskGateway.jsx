import React from 'react';
import { useLocation } from 'react-router-dom';

const BilldeskGateway = ({ errorMessage }) => {

  const location = useLocation()
  const paydata = location.state;

  const paymentData = JSON.parse(paydata.paymentData) || {};
  console.log(paymentData);
  // Parse paymentGatewayResponse if it exists
  const paymentResponseData = paymentData;



  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full mx-auto my-8 animate-fadeIn">
        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:-translate-y-1">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] transform rotate-45 -top-1/2 -left-1/2 w-[200%] h-[200%]"></div>
            <h4 className="text-xl font-semibold mb-1">
              {errorMessage || !paymentResponseData ? 'Payment Error' : 'Secure Payment Gateway'}
            </h4>
            <p className="text-sm">Powered by BillDesk</p>
          </div>

          {/* Body */}
          <div className="p-6">
            {errorMessage || !paymentResponseData ? (
              <div className="bg-red-100 border border-red-500 text-red-600 rounded-lg p-4 text-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {errorMessage ? (
                  <>
                    <p>Something went wrong, please try again later.</p>
                    <p>Please contact the administrator.</p>
                    <p>{errorMessage}</p>
                  </>
                ) : (
                  <p>No payment details available. Please try again later.</p>
                )}
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center text-gray-700 text-sm">
                  <p>Please review the payment details before proceeding. Once you're ready, click the button below to complete your payment securely.</p>
                  <div className="flex justify-center gap-2 mt-3 text-2xl text-green-600">
                    <i className="fas fa-angle-down animate-[arrowMove_0.6s_infinite]"></i>
                    <i className="fas fa-angle-down animate-[arrowMove_0.6s_infinite_0.2s]"></i>
                    <i className="fas fa-angle-down animate-[arrowMove_0.6s_infinite_0.4s]"></i>
                  </div>
                </div>

                <form
                  name="sdklaunch"
                  id="sdklaunch"
                  action="https://pay.billdesk.com/web/v1_2/embeddedsdk"
                  method="POST"
                  className="space-y-4"
                >
                  <input type="hidden" id="bdorderid" name="bdorderid" value={paymentResponseData?.bdorderid} />
                  <input type="hidden" id="merchantid" name="merchantid" value={paymentResponseData?.mercid} />
                  <input
                    type="hidden"
                    id="rdata"
                    name="rdata"
                    value={
                      paymentResponseData?.links?.find((link) => link.rel === 'redirect')?.parameters?.rdata
                    }
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                  >
                    <span className="absolute w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-300"></span>
                    <i className="fas fa-credit-card mr-2"></i>
                    Complete Your Payment
                  </button>
                </form>


                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mt-4 flex items-center justify-center w-fit mx-auto">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Secured by BillDesk
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes arrowMove {
          0% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(10px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BilldeskGateway;