import { useEffect, useRef, useState } from 'react';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ORDER_STATUS, ORDER_STATUS_PREPARING } from '@jmstechnologiesinc/order';

const ETA_INTERVAL = 1000;

const usePreparingTimeCoutdown = ({
    orderId,
    deliveryMethod,
    status,
    role,
    vendorAcceptedTime,
    deliveryTime,
    durationValue,
}) => {
    const interval = useRef();
    const [etaValue, setEtaValue] = useState(null);

    const clearEtaInterval = () => {
        interval.current && clearInterval(interval.current);
    };

    useEffect(() => {
        clearEtaInterval();

        if (role === USER_ROLES.customer && (ORDER_STATUS_PREPARING(status) || status === ORDER_STATUS.shipped)) {
            const etaInterval = () => {
                const transcurredTime = new Date().getTime() - vendorAcceptedTime.getTime();
                const deliveryTimeCountdown = durationValue - transcurredTime;

                if (deliveryTimeCountdown <= deliveryTime) {
                    clearEtaInterval();
                    setEtaValue(deliveryTime);
                } else {
                    setEtaValue(deliveryTimeCountdown);
                }
            };

            etaInterval();
            interval.current = setInterval(etaInterval, ETA_INTERVAL);
        } else {
            setEtaValue(undefined);
        }

        return clearEtaInterval;
    }, [durationValue, vendorAcceptedTime, deliveryMethod, status, orderId, role]);

    return etaValue;
};

export default usePreparingTimeCoutdown;
