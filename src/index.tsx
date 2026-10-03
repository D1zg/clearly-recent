import { definePlugin } from '@decky/api';
import { PanelSection, PanelSectionRow } from '@decky/ui';
import { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { installAdapter, initialStatus, type Status } from './steamAdapter';

export default definePlugin(() => {
  let status = initialStatus;
  const listeners = new Set<(value: Status) => void>();
  const stop = installAdapter((next) => {
    status = next;
    listeners.forEach((listener) => listener(next));
  });

  function Content() {
    const [current, setCurrent] = useState(status);
    useEffect(() => {
      listeners.add(setCurrent);
      setCurrent(status);
      return () => { listeners.delete(setCurrent); };
    }, []);
    return <PanelSection title="Clearly Recent">
      <PanelSectionRow><div>{current.message}</div></PanelSectionRow>
      <PanelSectionRow><div>Hidden from Recent: {current.hidden}</div></PanelSectionRow>
    </PanelSection>;
  }

  return {
    name: 'Clearly Recent', title: <div>Clearly Recent</div>,
    icon: <FaFilter />, content: <Content />,
    onDismount() { stop(); listeners.clear(); },
  };
});
