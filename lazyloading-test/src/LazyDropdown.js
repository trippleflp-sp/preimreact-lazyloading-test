import React, {useState, useEffect, useRef} from 'react';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const LazyDropdown = () => {
    const batchSize = 30;
    const [selectedItem, setSelectedItem] = useState(null);
    const items = useRef(Array.from({ length: 100000 }));
    const [loading, setLoading] = useState(false);
    const nextBatchNumber = useRef(0);
    const allLoaded = useRef(false);


    const onLazyLoad = async (event) => {
        const {first, last} = event;
        if(items.current[first] && items.current[last]) return;
        console.log(first, last,batchSize * (nextBatchNumber.current +1),last > batchSize * (nextBatchNumber.current +1))
        if(last > batchSize * (nextBatchNumber.current +1)) {
            console.log("BATCH:", Math.floor( last / batchSize ))
            await loadData(Math.floor(last / batchSize))
            return
            
        }
        const batch = await loadData(nextBatchNumber.current)
        if (allLoaded.current) return
        
        nextBatchNumber.current = parseInt(batch) +1;
    };

    const loadData = async (batch) => {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/items?batch=${batch}`);
        const data = await response.json();
        data.items.forEach(v => items.current[v.id] = ({ label: v.name, value: v.id }));
        setLoading(false);

        if (data.items.length === 0) {
            allLoaded.current = true
            return;
        }
        return data.batch
    }
    
    return (
        <div className="card flex justify-content-center">
            <Dropdown
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.value)}
                options={items.current}
                placeholder="Select Item"
                className="w-full md:w-14rem"
                virtualScrollerOptions={{
                    lazy: true,
                    onLazyLoad: onLazyLoad,
                    itemSize: batchSize,
                    showLoader: true,
                    loading: loading,
                }}
            />
        </div>
    );
};

export default LazyDropdown;