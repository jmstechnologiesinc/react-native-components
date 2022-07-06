import React from 'react';

import {Text, List} from '@jmsstudiosinc/react-native-paper';

const Breakdown = ({fees}) => {
    const results = [];

    const {total, ...rest} = fees;
    for (index in rest) {
        const {label, description, formattedValue} = rest[index];

        if(Array.isArray(rest[index])) {
            results.push(rest[index].map(({label, description, formattedValue}) => <List.Item 
                title={label}   
                description={description}    
                right={() => <Text variant="bodySmall">{formattedValue}</Text>} />
            ));        
        }

        results.push(<List.Item 
            title={label}   
            description={description}     
            right={() => <Text variant="bodySmall">{formattedValue}</Text>} />
        );
    }

    return  <List.Section>
        <List.Item
            title={() => <Text variant="headlineSmall">{total.label}</Text>}
            description={total.description} 
            right={() => <Text variant="headlineSmall">{total.formattedValue}</Text>}/>
        {results}
    </List.Section>
}

export default Breakdown;
