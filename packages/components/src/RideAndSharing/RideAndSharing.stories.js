import React, { useState } from 'react';

import RideAndSharingCheckout from './RideAndSharingCheckout';

import mockData from "../Accounting/mockData.json"
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

export default {
  title: 'packages/RideAndSharing',
};

const tipsFilter = {
  "description": "100% of your tips go to support your courier. Tips are calculated based on your order total of  $10.49 ",
  "selectedTipsPercentIndex": 2,
  "options": [
    {
      "value": 0,
      "formattedValue": "0"
    },
    {
      "value": 3,
      "formattedValue": "3%"
    },
    {
      "value": 5,
      "formattedValue": "5%"
    },
    {
      "value": 10,
      "formattedValue": "10%"
    },
    {
      "value": 13,
      "formattedValue": "13%"
    },
    {
      "value": 16,
      "formattedValue": "16%"
    },
    {
      "value": 19,
      "formattedValue": "19%"
    }
  ]
}

export const products = [
  {
    "data": [
      {
        "eta": {
          "duration": {
            "label": "Duration",
            "value": 6.381666666666666,
            "formattedValue": "7 minutes"
          },
          "formattedValue": "7 minutes · 0.9 mi",
          "distance": {
            "label": "Distance",
            "value": 0.9318064519999999,
            "formattedValue": "0.9 mi"
          }
        },
        "fees": {
          "total": {
            "amount": {
              "scale": 2,
              "currency": {
                "base": 10,
                "exponent": 2,
                "code": "USD"
              },
              "amount": 766
            },
            "id": "total",
            "description": null,
            "formattedValue": "$7.66",
            "label": "total"
          }
        },
        "vendor": {
          "id": "1AcokVeq5fO68QfNrjdg"
        },
        "estimatedCustomerFees": [
          {
            "label": "total",
            "formattedValue": "$7.66",
            "description": null,
            "id": "total",
            "amount": {
              "amount": 766,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "subTotal",
            "formattedValue": "$0.00",
            "description": null,
            "id": "subTotal",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "platformCommission(0%)",
            "formattedValue": "$0.00",
            "description": null,
            "id": "platformFee",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "smallOrderFee",
            "formattedValue": "$2.50",
            "description": null,
            "id": "smallOrderFee",
            "amount": {
              "amount": 250,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "deliveryFee",
            "formattedValue": "$5.16",
            "description": null,
            "id": "deliveryFee",
            "amount": {
              "amount": 516,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "tips",
            "formattedValue": "$0.00",
            "description": null,
            "id": "tips",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "pretaxTotal",
            "formattedValue": "$7.66",
            "description": null,
            "id": "pretaxTotal",
            "amount": {
              "amount": 766,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "aftertaxTotal",
            "formattedValue": "$7.66",
            "description": null,
            "id": "aftertaxTotal",
            "amount": {
              "amount": 766,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "taxes",
            "formattedValue": "$0.00",
            "description": null,
            "id": "taxes",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          }
        ],
        "driver": {
          "phoneNumber": "978 771 2261",
          "currency": null,
          "photo": null,
          "id": "5EUeUDxSXcsid5EbmgRAbxB5ILoB",
          "pushToken": null,
          "vehicle": null,
          "position": [
            -71.174945,
            42.707222
          ],
          "telemetry": {
            "estimated": {
              "formattedTotalDuration": "11 minutes 46 seconds",
              "pickupDuration": 6.381666666666666,
              "formattedPickupDistance": "0.9 mi",
              "dropOffDuration": 5.3966666666666665,
              "totalDistance": 2.071336895,
              "formattedTotalDistance": "2.1 mi",
              "formattedDropOffDistance": "1.1 mi",
              "formattedPickupDuration": "6 minutes 22 seconds",
              "totalDuration": 11.778333333333332,
              "pickupDistance": 0.9318064519999999,
              "dropOffDistance": 1.139530443,
              "formattedDropoffDuration": "5 minutes 23 seconds"
            }
          },
          "formattedName": "Gerson .S"
        },
        "title": "Gerson .S"
      },
      {
        "eta": {
          "duration": {
            "label": "Duration",
            "value": 13.768333333333334,
            "formattedValue": "14 minutes"
          },
          "formattedValue": "14 minutes · 3.8 mi",
          "distance": {
            "label": "Distance",
            "value": 3.7786131070000004,
            "formattedValue": "3.8 mi"
          }
        },
        "fees": {
          "total": {
            "amount": {
              "scale": 2,
              "currency": {
                "base": 10,
                "exponent": 2,
                "code": "USD"
              },
              "amount": 998
            },
            "id": "total",
            "description": null,
            "formattedValue": "$9.98",
            "label": "total"
          }
        },
        "vendor": {
          "id": "1AcokVeq5fO68QfNrjdg"
        },
        "estimatedCustomerFees": [
          {
            "label": "total",
            "formattedValue": "$9.98",
            "description": null,
            "id": "total",
            "amount": {
              "amount": 998,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "subTotal",
            "formattedValue": "$0.00",
            "description": null,
            "id": "subTotal",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "platformCommission(0%)",
            "formattedValue": "$0.00",
            "description": null,
            "id": "platformFee",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "smallOrderFee",
            "formattedValue": "$2.50",
            "description": null,
            "id": "smallOrderFee",
            "amount": {
              "amount": 250,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "deliveryFee",
            "formattedValue": "$7.48",
            "description": null,
            "id": "deliveryFee",
            "amount": {
              "amount": 748,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "tips",
            "formattedValue": "$0.00",
            "description": null,
            "id": "tips",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "pretaxTotal",
            "formattedValue": "$9.98",
            "description": null,
            "id": "pretaxTotal",
            "amount": {
              "amount": 998,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "aftertaxTotal",
            "formattedValue": "$9.98",
            "description": null,
            "id": "aftertaxTotal",
            "amount": {
              "amount": 998,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "taxes",
            "formattedValue": "$0.00",
            "description": null,
            "id": "taxes",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          }
        ],
        "driver": {
          "phoneNumber": "978 771 2261",
          "currency": null,
          "photo": null,
          "id": "AsBOsF8MOPhmAxrMLwIVIUHdIhb2",
          "pushToken": null,
          "vehicle": null,
          "position": [
            -71.139385,
            42.682585
          ],
          "telemetry": {
            "estimated": {
              "formattedTotalDuration": "19 minutes 9 seconds",
              "pickupDuration": 13.768333333333334,
              "formattedPickupDistance": "3.8 mi",
              "dropOffDuration": 5.3966666666666665,
              "totalDistance": 4.91814355,
              "formattedTotalDistance": "4.9 mi",
              "formattedDropOffDistance": "1.1 mi",
              "formattedPickupDuration": "13 minutes 46 seconds",
              "totalDuration": 19.165,
              "pickupDistance": 3.7786131070000004,
              "dropOffDistance": 1.139530443,
              "formattedDropoffDuration": "5 minutes 23 seconds"
            }
          },
          "formattedName": "Joely .M"
        },
        "title": "Joely .M"
      },
      {
        "eta": {
          "duration": {
            "label": "Duration",
            "value": 13.55,
            "formattedValue": "14 minutes"
          },
          "formattedValue": "14 minutes · 7.1 mi",
          "distance": {
            "label": "Distance",
            "value": 7.0933113720000005,
            "formattedValue": "7.1 mi"
          }
        },
        "fees": {
          "total": {
            "amount": {
              "scale": 2,
              "currency": {
                "base": 10,
                "exponent": 2,
                "code": "USD"
              },
              "amount": 1138
            },
            "id": "total",
            "description": null,
            "formattedValue": "$11.38",
            "label": "total"
          }
        },
        "vendor": {
          "id": "1AcokVeq5fO68QfNrjdg"
        },
        "estimatedCustomerFees": [
          {
            "label": "total",
            "formattedValue": "$11.38",
            "description": null,
            "id": "total",
            "amount": {
              "amount": 1138,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "subTotal",
            "formattedValue": "$0.00",
            "description": null,
            "id": "subTotal",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "platformCommission(0%)",
            "formattedValue": "$0.00",
            "description": null,
            "id": "platformFee",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "smallOrderFee",
            "formattedValue": "$2.50",
            "description": null,
            "id": "smallOrderFee",
            "amount": {
              "amount": 250,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "deliveryFee",
            "formattedValue": "$8.88",
            "description": null,
            "id": "deliveryFee",
            "amount": {
              "amount": 888,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "tips",
            "formattedValue": "$0.00",
            "description": null,
            "id": "tips",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "pretaxTotal",
            "formattedValue": "$11.38",
            "description": null,
            "id": "pretaxTotal",
            "amount": {
              "amount": 1138,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "aftertaxTotal",
            "formattedValue": "$11.38",
            "description": null,
            "id": "aftertaxTotal",
            "amount": {
              "amount": 1138,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          },
          {
            "label": "taxes",
            "formattedValue": "$0.00",
            "description": null,
            "id": "taxes",
            "amount": {
              "amount": 0,
              "currency": {
                "code": "USD",
                "exponent": 2,
                "base": 10
              },
              "scale": 2
            }
          }
        ],
        "driver": {
          "phoneNumber": "978 771 2261",
          "currency": "USD",
          "photo": "users/3QumEUy2gGg1jsv2jVSQGr2EIb82/C88F8A96-06CE-45C6-842C-6FE637B24579.jpg",
          "id": "3QumEUy2gGg1jsv2jVSQGr2EIb82",
          "pushToken": null,
          "vehicle": {
            "id": "iqAyzVYZ7uiHVLTrahhQ",
            "formattedValue": "Mercedes Benz · E350"
          },
          "position": [
            -71.195455,
            42.736319
          ],
          "telemetry": {
            "estimated": {
              "formattedTotalDuration": "18 minutes 56 seconds",
              "pickupDuration": 13.55,
              "formattedPickupDistance": "7.1 mi",
              "dropOffDuration": 5.3966666666666665,
              "totalDistance": 8.232841815,
              "formattedTotalDistance": "8.2 mi",
              "formattedDropOffDistance": "1.1 mi",
              "formattedPickupDuration": "13 minutes 33 seconds",
              "totalDuration": 18.946666666666665,
              "pickupDistance": 7.0933113720000005,
              "dropOffDistance": 1.139530443,
              "formattedDropoffDuration": "5 minutes 23 seconds"
            }
          },
          "formattedName": "Hector .G"
        },
        "title": "Hector .G"
      }
    ],
    "title": "Choose a Ride"
  }
]

export const Pricing = () => {
  return (

    <RideAndSharingCheckout
      originLocationDescription={"Origin Location"}
      dropoffLocationDescription={"Drop off Location"}
      tipsFilter={tipsFilter}
      products={products}
      fees={mockData}
      originLocation={{
        latitude: 42.707564063918513, longitude: -71.16235187906001,
        formattedAddress: "155 Boxford St, Lawrence MA 01843"
      }}
      dropoffLocation={{
        latitude: 42.71074176591852, longitude: -71.16283362348541,
        formattedAddress: "2 Railroad St, Lawrence MA 01841"
      }}
      onItemPress={() => null}
      onTipsPercentPress={() => null} />

  )
}




