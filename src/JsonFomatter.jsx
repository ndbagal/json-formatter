import React, { useState } from 'react';
import { MdRemoveCircleOutline } from 'react-icons/md';
import { MdAddCircleOutline } from 'react-icons/md';
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md';
import { VscSymbolString } from 'react-icons/vsc';
import { VscSymbolNamespace } from 'react-icons/vsc';
import { VscSymbolArray } from 'react-icons/vsc';
import { VscSymbolNumeric } from 'react-icons/vsc';
import { HiMiniNoSymbol } from 'react-icons/hi2';
import { RxComponentBoolean } from 'react-icons/rx';
import { Store } from 'react-notifications-component';

function JsonFormatter({ data }) {
  const [collapsedKeys, setCollapsedKeys] = useState({});
  const [isAllCollapsed, setIsAllCollapsed] = useState(false);
  let clickCount = 0;
  let singleClickTimer = '';

  const toggleCollapse = (key) => {
    setCollapsedKeys({
      ...collapsedKeys,
      [key]: !collapsedKeys[key],
    });
  };

  const toggleCollapseAll = () => {
    setIsAllCollapsed(!isAllCollapsed);
    const newCollapsedKeys = {};
    const traverse = (obj, path = []) => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            newCollapsedKeys[[...path, key]] = !isAllCollapsed;
          }
          traverse(obj[key], [...path, key]);
        });
      }
    };
    traverse(data);
    setCollapsedKeys(newCollapsedKeys);
  };

  const copyValueToClipboard = (value) => {
    navigator.clipboard
      .writeText(JSON.stringify(value, null, 2))
      .then(() => {
        Store.addNotification({
          title: 'Wonderful!',
          message: 'Value copied to clipboard',
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        // alert('Value copied to clipboard');
      })
      .catch((error) => console.error('Error copying to clipboard:', error));
  };

  const copyKeyToClipboard = (key) => {
    navigator.clipboard
      .writeText(key)
      .then(() => alert('Key copied to clipboard'))
      .catch((error) => console.error('Error copying to clipboard:', error));
  };

  const handleClicks = (key, value) => {
    clickCount++;
    if (clickCount === 1) {
      singleClickTimer = setTimeout(
        function () {
          clickCount = 0;
          copyKeyToClipboard(key);
        }.bind(this),
        300
      );
    } else if (clickCount === 2) {
      clearTimeout(singleClickTimer);
      clickCount = 0;
      copyValueToClipboard(value);
    }
  };

  const renderJson = (obj, path = [], depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      return String(obj);
    }

    return (
      <ul style={{ listStyleType: 'none', paddingLeft: '1.5rem' }}>
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <div style={{ alignItems: 'center' }}>
              {typeof value === 'object' && value !== null ? (
                <span
                  style={{
                    cursor: 'pointer',
                    paddingRight: '0.2rem',
                    color: 'blue',
                  }}
                  onClick={() => toggleCollapse([...path, key])}
                >
                  {collapsedKeys[[...path, key]] ? (
                    <MdAddCircleOutline className="inline-block" />
                  ) : (
                    <MdRemoveCircleOutline className="inline-block" />
                  )}
                </span>
              ) : (
                <span
                  style={{
                    paddingRight: '0.2rem',
                    color: '#757575',
                  }}
                >
                  <MdOutlineSubdirectoryArrowRight className="inline-block" />
                </span>
              )}
              <strong onClick={() => handleClicks(key, value)}>
                <span
                  style={{
                    paddingRight: '0.2rem',
                    color: '#757575',
                  }}
                >
                  {typeof value === 'string' && (
                    <VscSymbolString className="inline-block text-green-700" />
                  )}
                  {typeof value === 'number' && (
                    <VscSymbolNumeric className="inline-block text-gray-700" />
                  )}
                  {typeof value === 'boolean' && (
                    <RxComponentBoolean
                      className={
                        'inline-block' +
                        (value ? ' text-green-400' : ' text-gray-400')
                      }
                    />
                  )}
                  {(Array.isArray(value) && (
                    <VscSymbolArray className="inline-block" />
                  )) ||
                    (value === null && (
                      <HiMiniNoSymbol className="inline-block text-red-700" />
                    )) ||
                    (typeof value === 'object' && (
                      <VscSymbolNamespace className="inline-block" />
                    ))}
                </span>
                {key} :
              </strong>{' '}
              {collapsedKeys[[...path, key]] ? (
                <span onClick={() => toggleCollapse([...path, key])}>
                  {Array.isArray(value) ? '[...]' : '{...}'}
                </span>
              ) : (
                <span>{renderJson(value, [...path, key], depth + 1)}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="m-2">
        <button
          onClick={toggleCollapseAll}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isAllCollapsed ? 'Expand All' : 'Collapse All'}
        </button>
      </div>
      <div>{renderJson(data)}</div>
    </>
  );
}

export default JsonFormatter;
