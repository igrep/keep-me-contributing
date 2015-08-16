'use strict';

goog.require('goog.events.EventTarget');
goog.require('goog.dom');

describe('ContributionStatusView', function(){
  before(function(){
    this.contributionStatus = new goog.events.EventTarget();

    this.username = 'github_user_name';
    this.describedClass = KeepMeContributing.ContributionStatusView;
    this.describedInstance = new this.describedClass(this.username, this.contributionStatus);
  });

  describe('#render', function(){
    beforeEach(function(){
      this.targetElement = goog.dom.createElement(goog.dom.TagName.DIV);
      this.describedInstance.render(this.targetElement);
    });

    afterEach(function(){
      this.describedInstance.exitDocument();
    });

    context('when a CONTRIBUTED event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.targetElement)).to.be(
          `Congratulations! ${this.username} has already contributed today!`
        );
      });
    });

    context('when a NOT_YET event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.NOT_YET);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.targetElement)).to.be(
          `Oh my... ${this.username} has NOT contributed yet today!`
        );
      });
    });

    context('when a ERROR event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.ERROR);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.targetElement)).to.be(
          `An error occurred while loading contribution status. See the developer console for details.`
        );
      });
    });

  });

});
