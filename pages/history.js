import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useRouter } from "next/router";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import styles from '@/styles/History.module.css';

export default function History() { 
    const router = useRouter();
    const [searchHistoryList] = useAtom(searchHistoryAtom);
    let parsedHistory = [];

    searchHistoryList.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e, index) { 
        router.push(`artwork?${searchHistoryList[index]}`);
    }

    function removeHistoryClicked(e, index) { 
        e.stopPropagation(); 
        setSearchHistory(current => {
            let x = [...current];
            x.splice(index, 1)
            return x;
        });
    }
    
    return (
      <>
        {parsedHistory.length === 0 ? (
            <Card>
                <Card.Body>
                    <h4>Nothing Here :(</h4>
                    Try searching for something else!
                </Card.Body>
            </Card>
        ) : (
            <ListGroup>
                {parsedHistory.map((historyItem, index) => (
                    <ListGroup.Item className={styles.historyListItem}
                        onClick={e => historyClicked(e,index)}>
                        {Object.keys(historyItem).map(key => (
                            <>
                                {key}: <strong>{historyItem[key]}</strong>&nbsp;
                            </>
                        ))}
                        <Button className="float-end" variant="danger" size="sm" 
                            onClick={e => removeHistoryClicked(e, index)}>&times;
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        )}
      </>
    );
  }