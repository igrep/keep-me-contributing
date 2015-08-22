package info.igreque.keepmecontributing.github;

import java.lang.Throwable;
import java.lang.Exception;

class ContributionsCalendarException extends Exception {
  ContributionsCalendarException(String message, Throwable t){
    super(message, t);
  }
}
