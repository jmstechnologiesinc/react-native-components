import React from 'react';

import {Text, List} from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '../../List/src';

const Accounting = ({fees}) => {
    const results = [];

    const {total, ...rest} = fees;
    for (index in rest) {
        const {label, description, formattedValue} = rest[index];

        if(Array.isArray(rest[index])) {
            results.push(rest[index].map(({label, description, formattedValue}) => <List.Item 
                title={label}   
                description={description}    
                right={() => <Metadata title={formattedValue} />} />
            ));        
        }

        results.push(<List.Item 
            title={label}   
            description={description}     
            right={() => <Metadata title={formattedValue} />} />
        );
    }

    return  <List.Section>
        <List.Item
            title={() => <Text variant="headlineSmall">{total.label}</Text>}
            description={total.description} 
            right={() => <Metadata title={total.formattedValue} />}/>
        {results}
    </List.Section>
}

export default Accounting;