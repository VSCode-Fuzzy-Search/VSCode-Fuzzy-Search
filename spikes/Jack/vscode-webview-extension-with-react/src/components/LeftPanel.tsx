/* eslint-disable @typescript-eslint/naming-convention */
import Button from 'components/Button';
import SearchBar from './SearchBar';

interface LeftPanelProp {
    message: string
}

function LeftPanel({
    message
}: LeftPanelProp){
    return (
        <div className='panel-wrapper'>
            <span className='panel-info'>{message}</span>
            <SearchBar placeholder='Search...' data={[]} />
           <Button></Button>
        </div>
    );
}

export default LeftPanel;