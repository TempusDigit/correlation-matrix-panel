import { e2e } from '@grafana/e2e';
import { TestSelectors } from '../../src/consts';

e2e.scenario({
  describeName: 'Viewing a panel with a correlation matrix chart',
  itName: 'Should display a correlation matrix panel',
  addScenarioDataSource: true,
  addScenarioDashBoard: true,
  scenario: () => {
    // Using e2e flows add automatically navigates to the added dashboard or panel.
    e2e.flows.addPanel();

    //
    cy.get('[id="test-data-scenario-select-A"]').click();
    cy.contains('CSV Content').scrollIntoView().click();

    const dataLines = [',A,B,C,D', 'A,1,0.2,-0.4,0.6', 'B,0.2,1,0.5,0.3', 'C,-0.4,0.5,1,0.1', 'D,0.6,0.3,0.1,1'];
    //
    e2e.components.CodeEditor.container().find('textarea').type(dataLines.join('{enter}'));

    // change viz type after inputing data because if you add data after changing viz you also need to refresh chart manually
    e2e.components.PanelEditor.toggleVizPicker().click();
    e2e.components.PluginVisualization.item('Correlation matrix').scrollIntoView().click();

    const screenshotName = 'correlation-matrix-chart';
    //
    cy.get(`[id="${TestSelectors.plotlyChart.root}"]`).should('be.visible').screenshot(screenshotName);
    e2e().compareScreenshots(screenshotName);
  },
});
