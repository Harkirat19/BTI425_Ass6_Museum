import { useAtom } from 'jotai';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { removeFromHistory } from '@/lib/UserData';

import styles from '@/styles/history.module.css';


export default function History() {

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  let parsedHistory = [];

  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`)
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  return (<>

    {parsedHistory.length > 0 ?

      <ListGroup >
        {parsedHistory.map((historyItem, index) => (
          <ListGroup.Item key={index} onClick={e => historyClicked(e, index)} className={styles.historyListItem}>
            {
              Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))
            }
            <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      :

      <Card>
        <Card.Body>
          <h4>Nothing Here :(</h4>
                    Try adding some new artwork to the list!
        </Card.Body>
      </Card>

    }

  </>);
}