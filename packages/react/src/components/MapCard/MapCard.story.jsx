import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';
import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';
import { DragAndDrop } from '../../utils/DragAndDropUtils';

import data from './storyFiles/data.json';
import options from './storyFiles/mapOptions';
import MapboxExample from './storyFiles/MapboxExample';
import MapboxDragPanelExample from './storyFiles/MapboxDragPanelExample';
import OpenLayersExample from './storyFiles/OpenLayersExample';
import MapCardREADME from './README.md';

export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export const MapboxStory = withReadme(MapCardREADME, () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    action('onCardAction')(actionType);
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setSettingsOpen(false);
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <MapboxExample
      data={data}
      options={options}
      isLegendFullWidth={boolean('isLegendFullWidth', false)}
      onCardAction={handleOnCardAction}
      availableActions={{ expand: true, settings: true }}
      isSettingPanelOpen={settingsOpen}
      isExpanded={isExpanded}
    />
  );
});

MapboxStory.story = {
  name: 'Using Mapbox',
};

export const MapboxDragPanelsStory = withReadme(MapCardREADME, () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    action('onCardAction')(actionType);
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setSettingsOpen(false);
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <DragAndDrop>
      <MapboxDragPanelExample
        data={data}
        options={options}
        isLegendFullWidth={boolean('isLegendFullWidth', false)}
        onCardAction={handleOnCardAction}
        availableActions={{ expand: true, settings: true }}
        isSettingPanelOpen={settingsOpen}
        isExpanded={isExpanded}
      />
    </DragAndDrop>
  );
});

MapboxDragPanelsStory.story = {
  name: 'Using Mapbox with draggable panels',
};

export const OpenlayersStory = withReadme(MapCardREADME, () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOnCardAction = (id, actionType) => {
    action('onCardAction')(actionType);
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setSettingsOpen(false);
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <OpenLayersExample
      data={data}
      options={options}
      isLegendFullWidth={boolean('isLegendFullWidth', false)}
      onCardAction={handleOnCardAction}
      availableActions={{ expand: true, settings: true }}
      isSettingPanelOpen={settingsOpen}
      isExpanded={isExpanded}
    />
  );
});

OpenlayersStory.story = {
  name: 'Using Open layers',
};

export default {
  title: '2 - Watson IoT Experimental/☢️ MapCard',
  decorators: [withKnobs, React.createElement],
  parameters: {
    component: MapboxStory,
  },
};
