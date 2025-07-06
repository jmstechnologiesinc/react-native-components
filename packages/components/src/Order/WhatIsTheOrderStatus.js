import { DRIVER_STATUS } from '@jmstechnologiesinc/driver';
import { DELIVERY_METHODS, PICKUP_METHODS, FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ITEM_TYPE } from '@jmstechnologiesinc/commons';

import { ORDER_STATUS, ORDER_STATUS_CANCELLED, ORDER_STATUS_PREPARING } from '@jmstechnologiesinc/order';
import { localized } from '../Localization/Localization';

export const whatIsTheOrderStatus = ({ order, role, driverStatus }) => {
    if (!order) return null;

    if (role === USER_ROLES.customer) {
        if (order.status === ORDER_STATUS.completed) {
            return {
                formattedTripStatus: null,
                buttons: [
                    {
                        title: localized('order.receipt'),
                        value: ITEM_TYPE.print,
                    },
                ],
            };
        } else if (ORDER_STATUS_CANCELLED(order.status) === true) {
            if (order.status === ORDER_STATUS.noDriverFound) {
            } else if (order.status === ORDER_STATUS.vendorRejected) {
            } else if (order.status === ORDER_STATUS.vendorCancelled) {
            } else if (order.status === ORDER_STATUS.selfCancelled) {
            } else if (order.status === ORDER_STATUS.customerCancelled) {
            }

            return {
                formattedTripStatus: null,
                buttons: [
                    {
                        title: localized('order.receipt'),
                        value: ITEM_TYPE.print,
                    },
                ],
            };
        } else if (order.status === ORDER_STATUS.placed) {
            if (order.fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
                return {
                    formattedTripStatus: localized('contactingTheVendor'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.customerCancelled,
                        },
                    ],
                    items: [
                        {
                            formattedValue: localized(order.pickupMethod),
                            value: order.pickupMethod,
                            type: ITEM_TYPE.takeout,
                        },
                    ],
                };
            } else {
                return {
                    formattedTripStatus: localized('contactingTheVendor'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.customerCancelled,
                        },
                    ],
                    items: [],
                };
            }
        } else if (order.deliveryMethod === DELIVERY_METHODS.marketPlace) {
            const buttons = [
                {
                    title: localized('global.cancel'),
                    value: ORDER_STATUS.customerCancelled,
                },
            ];
            if (ORDER_STATUS_PREPARING(order.status)) {
                if (order.status === ORDER_STATUS.driverPending) {
                    return {
                        formattedTripStatus: localized('order.driverPending'),
                        buttons,
                    };
                } else if (order.status === ORDER_STATUS.driverAccepted) {
                    return {
                        formattedTripStatus: localized('order.driverAccepted'),
                        buttons,
                    };
                } else {
                    return {
                        formattedTripStatus: localized('order.lookingForDriver'),
                        buttons,
                    };
                }
            } else if (order.status === ORDER_STATUS.shipped) {
                return {
                    formattedTripStatus: localized('order.headingToPickup'),
                    buttons,
                };
            } else if (order.status === ORDER_STATUS.inTransit) {
                if (driverStatus === DRIVER_STATUS.arrived) {
                    return {
                        formattedTripStatus: localized('order.customerArrived'),
                        buttons,
                    };
                } else {
                    return {
                        formattedTripStatus: localized('order.headingToDropOff'),
                        buttons,
                    };
                }
            }
        } else if (order.deliveryMethod === DELIVERY_METHODS.ownStaff) {
            if (ORDER_STATUS_PREPARING(order.status)) {
                if (order.status === ORDER_STATUS.driverPending) {
                    return {
                        formattedTripStatus: localized('order.driverPending'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.customerCancelled,
                            },
                        ],
                    };
                } else if (order.status === ORDER_STATUS.driverAccepted) {
                    return {
                        formattedTripStatus: localized('order.driverAccepted'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.customerCancelled,
                            },
                        ],
                    };
                } else if (order.status === ORDER_STATUS.driverRejected) {
                    return {
                        formattedTripStatus: localized('order.lookingForDriver'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.customerCancelled,
                            },
                        ],
                    };
                }
            } else if (order.status === ORDER_STATUS.shipped) {
                if (!order.driver?.formattedName) {
                    return {
                        formattedTripStatus: localized('order.vendorOwnStaffDeliveryContact'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.customerCancelled,
                            },
                        ],
                    };
                } else {
                    return {
                        formattedTripStatus: localized('order.headingToPickup'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.customerCancelled,
                            },
                        ],
                    };
                }
            } else if (order.status === ORDER_STATUS.inTransit) {
                if (!order.driver?.formattedName) {
                    if (driverStatus === DRIVER_STATUS.arrived) {
                        return {
                            formattedTripStatus: `${localized('order.arrived')} ${localized('order.meetOutside')}`,
                            buttons: [
                                {
                                    title: localized('global.cancel'),
                                    value: ORDER_STATUS.customerCancelled,
                                },
                            ],
                        };
                    } else {
                        return {
                            formattedTripStatus: localized('order.vendorOwnStaffDeliveryContact'),
                            buttons: [
                                {
                                    title: localized('global.cancel'),
                                    value: ORDER_STATUS.customerCancelled,
                                },
                            ],
                        };
                    }
                } else {
                    if (driverStatus === DRIVER_STATUS.arrived) {
                        return {
                            formattedTripStatus: `${localized('order.arrived')} ${localized('order.meetOutside')}`,
                            buttons: [
                                {
                                    title: localized('global.cancel'),
                                    value: ORDER_STATUS.customerCancelled,
                                },
                            ],
                        };
                    } else {
                        return {
                            formattedTripStatus: localized('order.headingToDropOff'),
                            buttons: [
                                {
                                    title: localized('global.cancel'),
                                    value: ORDER_STATUS.customerCancelled,
                                },
                            ],
                        };
                    }
                }
            }
        } else if (order.deliveryMethod === DELIVERY_METHODS.flexible) {
            if (order.status === ORDER_STATUS.vendorAccepted || order.status === ORDER_STATUS.driverRejected) {
                return {
                    formattedTripStatus: localized('order.lookingForDriver'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.customerCancelled,
                        },
                    ],
                };
            }
        } else if (order.pickupMethod === PICKUP_METHODS.customerPickup) {
            if (order.status === ORDER_STATUS.vendorAccepted) {
                return {
                    formattedTripStatus: localized('order.preparingPickup'),
                    items: [
                        {
                            formattedValue: localized(order.pickupMethod),
                            value: order.pickupMethod,
                            type: ITEM_TYPE.takeout,
                        },
                    ],
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.customerCancelled,
                        },
                    ],
                };
            } else if (order.status === ORDER_STATUS.readyforPickup) {
                return {
                    formattedTripStatus: localized('order.readyForPickup'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.customerCancelled,
                        },
                    ],
                    items: [
                        {
                            formattedValue: localized(order.pickupMethod),
                            value: order.pickupMethod,
                            type: ITEM_TYPE.takeout,
                        },
                    ],
                };
            }
        }
    } else if (role === USER_ROLES.vendor) {
        if (order.status === ORDER_STATUS.completed) {
        } else if (ORDER_STATUS_CANCELLED(order.status) === true) {
            if (order.status === ORDER_STATUS.noDriverFound) {
                return {
                    formattedTripStatus: localized('order.noDriverFound'),
                };
            } else if (order.status === ORDER_STATUS.selfCancelled) {
                return {
                    formattedTripStatus: localized('order.vendor.selfCancelled'),
                };
            }
        } else if (order.status === ORDER_STATUS.placed) {
            return {
                formattedTripStatus: localized('order.vendorPlaced'),
                buttons: [
                    {
                        title: localized('order.reject'),
                        value: ORDER_STATUS.vendorRejected,
                    },
                    {
                        title: localized('order.accept'),
                        value: ORDER_STATUS.vendorAccepted,
                    },
                ],
                items: [
                    {
                        formattedValue:
                            order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                                ? order.deliveryMethod
                                : localized(order.pickupMethod),
                        value:
                            order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                                ? order.deliveryMethod
                                : order.pickupMethod,
                        type:
                            order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                                ? ITEM_TYPE.driver
                                : ITEM_TYPE.takeout,
                    },
                ],
            };
        } else if (order.deliveryMethod === DELIVERY_METHODS.marketPlace) {
            if (ORDER_STATUS_PREPARING(order.status)) {
                if (order.status === ORDER_STATUS.driverPending) {
                    return {
                        formattedTripStatus: localized('order.driverPending'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.vendorCancelled,
                            },
                            {
                                title: localized('order.receipt'),
                                value: ITEM_TYPE.print,
                            },
                        ],
                        items: [
                            {
                                formattedValue: order.deliveryMethod,
                                value: order.deliveryMethod,
                                type: ITEM_TYPE.driver,
                            },
                        ],
                    };
                } else if (order.status === ORDER_STATUS.driverAccepted) {
                    return {
                        formattedTripStatus: localized('order.driverAccepted'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.vendorCancelled,
                            },
                            {
                                title: localized('order.receipt'),
                                value: ITEM_TYPE.print,
                            },
                        ],
                        items: [
                            {
                                formattedValue: order.deliveryMethod,
                                value: order.deliveryMethod,
                                type: ITEM_TYPE.driver,
                            },
                        ],
                    };
                } else if (order.status === ORDER_STATUS.driverRejected) {
                    return {
                        formattedTripStatus: localized('order.lookingForAnotherDriver'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.vendorCancelled,
                            },
                            {
                                title: localized('order.receipt'),
                                value: ITEM_TYPE.print,
                            },
                        ],
                        items: [
                            {
                                formattedValue: order.deliveryMethod,
                                value: order.deliveryMethod,
                                type: ITEM_TYPE.driver,
                            },
                        ],
                    };
                }
            } else if (order.status === ORDER_STATUS.shipped) {
                return {
                    formattedTripStatus: localized('order.headingToPickup'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.vendorCancelled,
                        },
                        {
                            title: localized('order.receipt'),
                            value: ITEM_TYPE.print,
                        },
                    ],
                    items: [
                        {
                            formattedValue: order.deliveryMethod,
                            value: order.deliveryMethod,
                            type: ITEM_TYPE.driver,
                        },
                    ],
                };
            } else if (order.status === ORDER_STATUS.inTransit) {
                let formattedTripStatus;
                if (driverStatus === DRIVER_STATUS.arrived) {
                    formattedTripStatus = localized('order.arrived');
                } else {
                    formattedTripStatus = localized('order.headingToDropOff');
                }
                return {
                    formattedTripStatus,
                    buttons: [
                        {
                            title: localized('order.receipt'),
                            value: ITEM_TYPE.print,
                        },
                    ],
                    items: [
                        {
                            formattedValue: order.deliveryMethod,
                            value: order.deliveryMethod,
                            type: ITEM_TYPE.driver,
                        },
                    ],
                };
            }
        } else if (order.deliveryMethod === DELIVERY_METHODS.ownStaff) {
            if (ORDER_STATUS_PREPARING(order.status) === true) {
                let formattedTripStatus,
                    items = [];
                if (order.status === ORDER_STATUS.driverPending) {
                    formattedTripStatus = localized('order.staffPending');
                } else if (order.status === ORDER_STATUS.driverAccepted) {
                    formattedTripStatus = localized('order.driverAccepted');
                } else if (order.status === ORDER_STATUS.driverRejected) {
                    formattedTripStatus = localized('order.staffReassigning');
                    items = [
                        {
                            formattedValue: order.deliveryMethod,
                            value: order.deliveryMethod,
                            type: ITEM_TYPE.driver,
                        },
                    ];
                } else {
                    formattedTripStatus = localized('order.lookingForStaff');
                    items = [
                        {
                            formattedValue: order.deliveryMethod,
                            value: order.deliveryMethod,
                            type: ITEM_TYPE.driver,
                        },
                    ];
                }
                return {
                    formattedTripStatus,
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.vendorCancelled,
                        },

                        {
                            title: localized('order.receipt'),
                            value: ITEM_TYPE.print,
                        },
                    ],
                    items,
                };
            } else if (order.status === ORDER_STATUS.shipped) {
                if (!order.driver?.formattedName) {
                    return {
                        formattedTripStatus: localized('order.noStaffDriverFound'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.vendorCancelled,
                            },
                            {
                                title: localized('order.receipt'),
                                value: ITEM_TYPE.print,
                            },
                            {
                                title: localized('order.inTransit'),
                                value: ORDER_STATUS.inTransit,
                            },
                        ],
                        items: [
                            {
                                formattedValue: order.deliveryMethod,
                                value: order.deliveryMethod,
                                type: ITEM_TYPE.driver,
                            },
                            {
                                formattedValue: localized('order.needAttention'),
                                value: null,
                                type: ITEM_TYPE.needAttention,
                            },
                        ],
                    };
                } else {
                    return {
                        formattedTripStatus: localized('order.headingToPickup'),
                        buttons: [
                            {
                                title: localized('global.cancel'),
                                value: ORDER_STATUS.vendorCancelled,
                            },

                            {
                                title: localized('order.receipt'),
                                value: ITEM_TYPE.print,
                            },
                        ],
                    };
                }
            } else if (order.status === ORDER_STATUS.inTransit) {
                if (!order.driver?.formattedName) {
                    return {
                        formattedTripStatus:
                            driverStatus === DRIVER_STATUS.arrived
                                ? `${localized('order.arrived')} ${localized('order.markAsCompleteOnDelivery')}`
                                : `${localized('order.vendorInTransit')} ${localized(
                                      'order.markAsCompleteOnDelivery'
                                  )}`,
                        buttons: [
                            {
                                title: localized('order.Completed'),
                                value: ORDER_STATUS.completed,
                            },
                        ],
                        items: [
                            {
                                formattedValue: order.deliveryMethod,
                                value: order.deliveryMethod,
                                type: ITEM_TYPE.driver,
                            },
                            {
                                formattedValue: localized('order.needAttention'),
                                value: null,
                                type: ITEM_TYPE.needAttention,
                            },
                        ],
                    };
                } else {
                    if (driverStatus === DRIVER_STATUS.arrived) {
                        return {
                            formattedTripStatus: localized('order.arrived'),
                        };
                    } else {
                        return {
                            formattedTripStatus: localized('order.headingToDropOff'),
                        };
                    }
                }
            }
        } else if (order.deliveryMethod === DELIVERY_METHODS.flexible) {
            let formattedTripStatus;
            if (order.status === ORDER_STATUS.vendorAccepted) {
                formattedTripStatus = localized('order.lookingForDriver');
            } else if (order.status === ORDER_STATUS.driverRejected) {
                formattedTripStatus = localized('order.lookingForAnotherDriver');
            }

            return {
                formattedTripStatus,
                buttons: [
                    {
                        title: localized('global.cancel'),
                        value: ORDER_STATUS.vendorCancelled,
                    },
                    {
                        title: localized('order.receipt'),
                        value: ITEM_TYPE.print,
                    },
                ],
                items: [
                    {
                        formattedValue: order.deliveryMethod,
                        value: order.deliveryMethod,
                        type: ITEM_TYPE.driver,
                    },
                ],
            };
        } else if (order.pickupMethod === PICKUP_METHODS.customerPickup) {
            if (order.status === ORDER_STATUS.vendorAccepted) {
                return {
                    formattedTripStatus: localized('order.readyForPickupReminder'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.vendorCancelled,
                        },
                        {
                            title: localized('order.receipt'),
                            value: ITEM_TYPE.print,
                        },
                        {
                            title: localized('Ready for Pickup'),
                            value: ORDER_STATUS.readyforPickup,
                        },
                    ],
                    items: [
                        {
                            formattedValue: localized(order.pickupMethod),
                            value: order.pickupMethod,
                            type: ITEM_TYPE.takeout,
                        },
                        {
                            formattedValue: localized('order.needAttention'),
                            value: null,
                            type: ITEM_TYPE.needAttention,
                        },
                    ],
                };
            } else if (order.status === ORDER_STATUS.readyforPickup) {
                return {
                    formattedTripStatus: localized('order.vendorReadyforPickup'),
                    buttons: [
                        {
                            title: localized('global.cancel'),
                            value: ORDER_STATUS.vendorCancelled,
                        },
                        {
                            title: localized('order.receipt'),
                            value: ITEM_TYPE.print,
                        },
                        {
                            title: localized('order.Completed'),
                            value: ORDER_STATUS.completed,
                        },
                    ],
                    items: [
                        {
                            formattedValue: localized(order.pickupMethod),
                            value: order.pickupMethod,
                            type: ITEM_TYPE.takeout,
                        },
                        {
                            formattedValue: localized('order.needAttention'),
                            value: null,
                            type: ITEM_TYPE.needAttention,
                        },
                    ],
                };
            }
        }
    }
};
