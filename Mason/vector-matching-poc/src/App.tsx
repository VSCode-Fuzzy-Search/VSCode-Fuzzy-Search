import _ from 'lodash';
import React from 'react';
import { useFilePicker } from 'use-file-picker';
import './App.css';
import { Collection } from './vector/Collection';
import { Document } from './vector/Document';

function App() {

  const [query, setQuery] = React.useState<string>('');

  const collection = new Collection();

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.txt',
    multiple: true
  });

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Header */}
      <div>
        <h1>Vector Matching PoC</h1>
        <p>Employing cosine similarity to match document vectors.</p>
      </div>

      {
        /**
         * Main content
         * 
         * - Upload documents
         * - Match documents
         * - Display results
         */
      }
      <div>
        {/* Upload documents */}
        <div>
          <h2>Upload Documents</h2>
          <p>Upload documents to match against.</p>
          <button onClick={openFilePicker}>Select Files</button>
          <br />
          {filesContent.map((file, index) => {

            collection.addDocument(new Document(file.content));

            return <div key={index}>
              <h2>{file.name}</h2>
              <div>{_.truncate(file.content, { length: 80 })}</div>
              <br />
            </div>
          })}
        </div>

        {/* Match document */}
        <div>
          <h2>Match Document</h2>
          <p>Input text to match against uploaded documents.</p>
          <textarea value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {/* Display results */}
        <div>
          <h2>Results</h2>
          <p>Display the results of the matching process.</p>
          <div>
            <h3>Matched Documents</h3>
            <ul>
              {Array.from(collection.similarity(new Document(query), collection.documents).entries())
                .sort(([, sim1], [, sim2]) => sim2 - sim1)
                .map(([document, similarity], index) => <li key={index}>{_.truncate(document.content, { length: 80 })} - {similarity}</li>)
              }
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div>
        <p>Created by <a href="https://github.com/Brittank88">Brittank88</a></p>
      </div>
    </>
  )
}

export default App
