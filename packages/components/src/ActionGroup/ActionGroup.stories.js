import React from 'react';

export default {
  title: 'packages/ActionGroup',
};

import * as ActionGroup from "./ActionGroup";

export const IconsOnly = () => (
  <ActionGroup.Group>
      <ActionGroup.Icons icons={[{icon: "chevron-up"}, {icon: "chevron-down"}]}/>
  </ActionGroup.Group>
);

export const ButtonsOnly = () => (
  <ActionGroup.Group>
      <ActionGroup.Buttons buttons={[{title: "Print"}, {title: "Cancel"}, {title: "Accept"}]}/>
  </ActionGroup.Group>
);

export const SingleButton = () => (
  <ActionGroup.Group>
      <ActionGroup.Buttons isStretched buttons={[{title: "Print"}]}/>
  </ActionGroup.Group>
);

export const FabsOnly = () => (
  <ActionGroup.Group>
      <ActionGroup.Buttons variant="fab" buttons={[{title: "Print"}, {title: "Cancel"}, {title: "Accept"}]}/>
  </ActionGroup.Group>
);

export const IconsAndFabs = () => (
  <ActionGroup.Group>
      <ActionGroup.Icons icons={[{icon: "chevron-up"}, {icon: "chevron-down"}]}/>
      <ActionGroup.Buttons variant="fab" buttons={[{title: "Print"}, {title: "Cancel"}, {title: "Accept"}]}/>
  </ActionGroup.Group>
);

export const IconsAndButtons = () => (
  <ActionGroup.Group>
      <ActionGroup.Icons icons={[{icon: "chevron-up"}, {icon: "chevron-down"}]}/>
      <ActionGroup.Buttons  buttons={[{title: "Print"}, {title: "Cancel"}, {title: "Accept"}]}/>
  </ActionGroup.Group>
);