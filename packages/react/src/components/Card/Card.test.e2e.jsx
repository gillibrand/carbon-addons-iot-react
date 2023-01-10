import React from 'react';
import { mount } from '@cypress/react';

import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { CARD_SIZES } from '../../constants/LayoutConstants';

import Card from './Card';

describe('Card', () => {
  beforeEach(() => {
    cy.viewport(1680, 900);
  });

  it('should lazy-load content when isLazyLoading:true', () => {
    const ManyCards = () =>
      Array(8)
        .fill()
        .map((_, i) => (
          <Card
            title={`Lazy loading card #${i}`}
            id={`card-${i}`}
            key={`card-${i}`}
            size={CARD_SIZES.MEDIUM}
            breakpoint="lg"
            isLazyLoading
          >
            {(childSize) => (
              <p>
                Card with a renderprop. The content width is {childSize.width} and height is{' '}
                {childSize.height}
              </p>
            )}
          </Card>
        ));
    mount(<ManyCards />);

    // only three loaded at first.
    cy.findAllByText(/renderprop/).should('have.length', 3);

    // scroll down to load the rest.
    cy.scrollTo('bottom', { duration: 1000 });
    cy.findAllByText(/renderprop/).should('have.length', 8);
  });

  it('should render tooltip if the text is too long', () => {
    const aLongTitle =
      'A very very long title which will almost certainly overflow and require a tooltip and we must test these things, you know.';
    mount(
      <Card
        style={{ width: '400px', height: '360px' }}
        id="myCard"
        title={aLongTitle}
        size={CARD_SIZES.MEDIUM}
      />
    );

    cy.findByRole('button', { name: aLongTitle }).should('exist');
  });

  it('should not render tooltip if the text is not too long', () => {
    const aShortTitle = 'A short title';
    mount(
      <Card
        style={{ width: '600px', height: '360px' }}
        id="myCard"
        title={aShortTitle}
        size={CARD_SIZES.MEDIUM}
        breakpoint="lg"
      />
    );

    cy.findByRole('button', { name: aShortTitle }).should('not.exist');
  });

  it('should close title tooltip in title if window is scrolled', () => {
    const title =
      'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.';

    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title={title}
          subtitle="Lorem ipsum"
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
        />
      </div>
    );

    cy.findByRole('button', { name: title }).click();
    cy.findByTestId('Card-title-tooltip').should('exist');
    cy.findByTestId('Card-title-tooltip').should('be.visible');

    cy.scrollTo(0, 500, {
      duration: 500,
    });

    cy.findByTestId('Card-title-tooltip').should('not.exist');
  });

  it('should close subtitle tooltip in title if window is scrolled', () => {
    const subtitle =
      'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.';

    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title="Hello, world!"
          subtitle={subtitle}
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
          tooltip={<p>this is the external tooltip content</p>}
        />
      </div>
    );

    cy.findByRole('button', { name: subtitle }).click();
    cy.findByTestId('Card-subtitle').should('exist');
    cy.findByTestId('Card-subtitle').should('be.visible');

    cy.scrollTo(0, 500, {
      duration: 500,
    });

    cy.findByTestId('Card-subtitle').should('not.exist');
  });

  it('should close info icon tooltip in title if window is scrolled', () => {
    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title="Hello, world!"
          subtitle="Subtitle"
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
          tooltip={<p>this is the external tooltip content</p>}
        />
      </div>
    );

    cy.findByRole('button', { name: 'Tooltip info icon' }).click();
    cy.findByTestId('Card-tooltip').should('exist');
    cy.findByTestId('Card-tooltip').should('be.visible');

    cy.scrollTo(0, 500, {
      duration: 500,
    });

    cy.findByTestId('Card-tooltip').should('not.exist');
  });

  describe('Card title tooltips', () => {
    const title =
      'Title Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vulputate lectus id nulla euismod hendrerit. Integer enim arcu, volutpat non erat vitae, ullamcorper tincidunt enim. Sed porttitor fringilla sapien sit amet finibus.';
    const subtitle =
      'Subtitle Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vulputate lectus id nulla euismod hendrerit. Integer enim arcu, volutpat non erat vitae, ullamcorper tincidunt enim. Sed porttitor fringilla sapien sit amet finibus.';
    const breakpoint = 'lg';
    const size = CARD_SIZES.SMALL;

    it('should auto adjust tooltip alignment', () => {
      mount(
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Card
            testId="start"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
          <Card
            testId="center"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
          <Card
            testId="end"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
        </div>
      );

      const windowWidth = Cypress.$(cy.state('window')).width();

      // Left card
      cy.findAllByRole('button', { name: title }).eq(0).click();
      cy.findByTestId('start-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(0).click();
      cy.findByTestId('start-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
      });

      // Middle card
      cy.findAllByRole('button', { name: title }).eq(1).click();
      cy.findByTestId('center-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.right).not.to.be.greaterThan(windowWidth);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(1).click();
      cy.findByTestId('center-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.right).not.to.be.greaterThan(windowWidth);
      });

      // Right card
      cy.findAllByRole('button', { name: title }).eq(2).click();
      cy.findByTestId('end-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).not.to.be.greaterThan(windowWidth);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(2).click();
      cy.findByTestId('end-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).not.to.be.greaterThan(windowWidth);
      });
    });

    it('should auto adjust tooltip direction and alignment', () => {
      mount(
        <div
          style={{
            height: '900px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
          }}
        >
          <Card
            testId="start"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
          <Card
            testId="center"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
          <Card
            testId="end"
            style={{ width: `${getCardMinSize(breakpoint, size).x}px` }}
            title={title}
            subtitle={subtitle}
            hasTitleWrap
            id="facilitycard-basic"
            size={size}
            breakpoint={breakpoint}
          />
        </div>
      );

      const windowWidth = Cypress.$(cy.state('window')).width();
      const windowHeight = Cypress.$(cy.state('window')).height();

      // Left card
      cy.findAllByRole('button', { name: title }).eq(0).click();
      cy.findByTestId('start-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(0).click();
      cy.findByTestId('start-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });

      // Middle card
      cy.findAllByRole('button', { name: title }).eq(1).click();
      cy.findByTestId('center-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.right).not.to.be.greaterThan(windowWidth);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(1).click();
      cy.findByTestId('center-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.left).to.be.greaterThan(0);
        expect(rect.right).not.to.be.greaterThan(windowWidth);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });

      // Right card
      cy.findAllByRole('button', { name: title }).eq(2).click();
      cy.findByTestId('end-title-tooltip').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).not.to.be.greaterThan(windowWidth);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });

      cy.findAllByRole('button', { name: subtitle }).eq(2).click();
      cy.findByTestId('end-subtitle').then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).not.to.be.greaterThan(windowWidth);
        expect(rect.bottom).not.to.be.greaterThan(windowHeight);
      });
    });
  });
});
