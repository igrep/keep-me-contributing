'use strict';

goog.require('goog.events.EventTarget');
goog.require('goog.dom');

describe('FaviconView', function(){
  before(function(){
    this.contributionStatus = new goog.events.EventTarget();

    this.describedClass = KeepMeContributing.FaviconView;
    this.describedInstance = new this.describedClass(this.contributionStatus);
  });

  describe('#render', function(){
    beforeEach(function(){
      this.targetElement = goog.dom.createElement(goog.dom.TagName.LINK);
      this.describedInstance.decorate(this.targetElement);
      this.subjectElement = this.describedInstance.getElement();
    });

    afterEach(function(){
      this.describedInstance.exitDocument();
    });

    context('when a CONTRIBUTED event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.CONTRIBUTED);
      });

      it('changes the link to favicon to show contributed.', function(){
        expect(this.subjectElement.href).to.contain('img/favicon-contributed.ico');
      });
    });

    context('when a NOT_YET event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.NOT_YET);
      });

      it('changes the link to favicon to show not_yet.', function(){
        expect(this.subjectElement.href).to.contain('img/favicon-not_yet.ico');
      });
    });

    context('when a ERROR event happens', function(){
      beforeEach(function(){
        this.contributionStatus.dispatchEvent(KeepMeContributing.ContributionStatus.Events.ERROR);
      });

      it('changes the link to favicon to show error.', function(){
        expect(this.subjectElement.href).to.contain('img/favicon-error.ico');
      });
    });

  });

});
