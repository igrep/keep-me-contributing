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
      this.subjectElement = this.describedInstance.getElement();
    });

    afterEach(function(){
      this.describedInstance.exitDocument();
    });

    context('when a CONTRIBUTED event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.subjectElement)).to.be(
          `Congratulations! ${this.username} has already contributed today!`
        );
      });

      it('sets the css class "success"', function(){
        let classList = goog.dom.classlist.get(this.subjectElement);
        expect(classList[0]).to.be('success');
        expect(classList.length).to.be(1);
      });
    });

    context('when a NOT_YET event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.NOT_YET);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.subjectElement)).to.be(
          `Oh my... ${this.username} has NOT contributed yet today!`
        );
      });

      it('sets the css class "danger"', function(){
        let classList = goog.dom.classlist.get(this.subjectElement);
        expect(classList[0]).to.be('danger');
        expect(classList.length).to.be(1);
      });
    });

    context('when a ERROR event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.ERROR);
      });

      it('renders a message showing that the user has already contributed', function(){
        expect(goog.dom.getTextContent(this.subjectElement)).to.be(
          'An error occurred while loading contribution status. See the developer console for details.'
        );
      });

      it('sets the css class "warning"', function(){
        let classList = goog.dom.classlist.get(this.subjectElement);
        expect(classList[0]).to.be('warning');
        expect(classList.length).to.be(1);
      });
    });

  });

});
