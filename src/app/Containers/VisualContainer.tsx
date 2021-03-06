import React, {useState} from 'react';
import Diff from '../components/StateDiff/Diff';
import NavBar from '../components/NavBar/NavBar';
import Visualizer from '../components/StateGraph/Visualizer';
import Tree from '../components/StateTree/Tree';
import Network from '../components/AtomNetwork/AtomNetwork';
import AtomComponentVisualContainer from '../components/ComponentGraph/AtomComponentContainer';
import Settings from '../components/Settings/SettingsContainer';
import {stateSnapshot, selectedTypes} from '../../types';

interface VisualContainerProps {
  // snapshot at index [curRender -1]
  previousSnapshot: stateSnapshot;
  // snapshot at index [curRender]
  currentSnapshot: stateSnapshot;
  // ! passing through snapshot history
  snapshotHistory: stateSnapshot[];
  selected: selectedTypes[];
  setSelected: React.Dispatch<React.SetStateAction<selectedTypes[]>>;
}

interface ZoomState {
  x: number;
  y: number;
  k: number;
}

type navTypes = {
  [tabName: string]: JSX.Element;
};

// Renders Navbar and conditionally renders Diff, Visualizer, and Tree
const VisualContainer: React.FC<VisualContainerProps> = ({
  previousSnapshot,
  currentSnapshot,
  snapshotHistory,
  selected,
  setSelected,
}) => {
  // state for checkmark in persist state in settings
  const [checked, setChecked] = useState<boolean>(false);

  // variables to store/reference connection
  const [throttleDisplay, setThrottleDisplay] = useState<string>('70');

  // this state allows the canvas to stay at the zoom level on multiple re-renders
  const [{x, y, k}, setZoomState] = useState<ZoomState>({
    x: 50,
    y: 380,
    k: 0.07,
  });

  // conditional render of filtered snaps/ based on non-filtered snaps
  const filteredCurSnap = currentSnapshot
    ? currentSnapshot.filteredSnapshot
    : undefined;
  const filteredPrevSnap = previousSnapshot
    ? previousSnapshot.filteredSnapshot
    : undefined;
  const componentAtomTree = currentSnapshot
    ? currentSnapshot.componentAtomTree
    : undefined;
  // object containing all conditional renders based on navBar
  const nav: navTypes = {
    // compare the diff of filteredPrevSnap and filteredCurSnap
    'State Diff': (
      <Diff
        filteredPrevSnap={filteredPrevSnap}
        filteredCurSnap={filteredCurSnap}
      />
    ),
    // render JSON tree of snapshot
    'State Tree': <Tree filteredCurSnap={filteredCurSnap} />,
    // tree visualizer of components showing atom/selector relationships
    'Component Graph': (
      <AtomComponentVisualContainer
        componentAtomTree={componentAtomTree}
        filteredCurSnap={filteredCurSnap}
        x={x}
        y={y}
        k={k}
        setZoomState={setZoomState}
      />
    ),

    // atom and selector subscription relationship
    'Atom Network': <Network filteredCurSnap={filteredCurSnap} />,

    // individual snapshot visualizer
    'State Graph': <Visualizer filteredCurSnap={filteredCurSnap} />,

    // settings tab that doesn't want to be in quotes because too cool for school
    Settings: (
      <Settings
        snapshotHistory={snapshotHistory}
        selected={selected}
        setSelected={setSelected}
        checked={checked}
        setChecked={setChecked}
        throttleDisplay={throttleDisplay}
        setThrottleDisplay={setThrottleDisplay}
      />
    ),
  };
  // array of all nav obj keys
  const tabsList: string[] = Object.keys(nav);
  // useState hook to update which component to render in the VisualContainer
  const [tab, setTab] = useState<string>('State Diff');
  // conditionally render based on value of nav[tab]
  return (
    <div className="VisualContainer">
      <NavBar setTab={setTab} tabsList={tabsList} tab={tab} />
      {nav[tab]}
    </div>
  );
};

export default VisualContainer;
