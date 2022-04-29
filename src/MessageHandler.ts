export function MessageReceiver(
  win: Window,
  sourceOrigin: string,
  adapter: any
) {
  this.timeoutId = null;
  win.addEventListener(
    "message",
    function (e: MessageEvent) {
      if (e.origin !== sourceOrigin) return;
      const functionName = e.data["function"];
      const functionArgs = e.data["arguments"];
      if (
        functionName &&
        functionArgs &&
        typeof this[functionName] === "function"
      ) {
        this[functionName].apply(this, functionArgs);
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.commit();
          this.timeoutId = null;
        }, 500);
      }
    }.bind(this)
  );


  this.callCommit = function () {
    // Intentionally empty
  };


  this.commit = function () {
    adapter.LMSCommit();
  };

  this.finish = function () {
    adapter.LMSTerminate();
  }

  this.getAPI = function () {
    new MessageEmitter("http://forma.lms").setAPI(adapter._API);
  }

  this.setTitle = function (title: string) {
    document.title = title;
  };

  this.setExitType = function (exitType: string) {
    adapter.setExitType(exitType);
  };
  this.setScore = function (score: string) {
    adapter.setScore(score);
  };

  this.setLessonStatus = function (lessonStatus: string) {
    adapter.setLessonStatus(lessonStatus);
  };

  this.setObjectives = function (objectivesIds: string[]) {
    if (adapter.objectivesAreAvailable) {
      adapter.setObjectives(objectivesIds);
    }
  };

  this.setObjectiveScore = function (objectiveId: string, score: number) {
    if (adapter.objectivesAreAvailable) {
      adapter.setObjectiveScore(objectiveId, score);
    }
  };

  this.setObjectiveStatus = function (objectiveId: string, status: string) {
    if (adapter.objectivesAreAvailable) {
      adapter.setObjectiveStatus(objectiveId, status);
    }
  };
}

export class MessageEmitter {
  private currentWindow: Window;
  private lmsOrigin: string;

  // @ts-ignore
  constructor(lmsOrigin: string) {
    this.currentWindow = document.getElementsByTagName("iframe")[0].contentWindow;
    this.lmsOrigin = '*';
  }

  private sendMessage(
    name: string,
    values: (string[] | string | number | any)[]
  ): void {
    this.currentWindow.postMessage(
      {
        function: name,
        arguments: values,
      },
      this.lmsOrigin
    );
  }

  setAPI(API: any): void {
    this.sendMessage('setAPI', [API]);
  }

  setLessonStatus(status: string): void {
    this.sendMessage("setLessonStatus", [status]);
  }
  setScore(score: number): void {
    this.sendMessage("setScore", [score]);
  }
  setObjectives(objectives: string[]): void {
    this.sendMessage("setObjectives", [objectives]);
  }
  setObjectiveScore(objectiveId: string, score: number): void {
    this.sendMessage("setObjectiveScore", [objectiveId, score]);
  }
  setObjectiveStatus(
    objectiveId: string,
    status: "completed" | "incomplete"
  ): void {
    this.sendMessage("setObjectiveStatus", [objectiveId, status]);
  }
}
