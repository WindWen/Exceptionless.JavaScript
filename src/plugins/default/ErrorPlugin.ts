import { IEventPlugin } from '../IEventPlugin';
import { EventPluginContext } from '../EventPluginContext';

export class ErrorPlugin implements IEventPlugin {
  public priority:number = 30;
  public name:string = 'ErrorPlugin';

  public run(context:EventPluginContext, next?:() => void): void {
    const error:string = '@error'; // optimization for minifier.

    var exception = context.contextData.getException();
    if (!!exception) {
      context.event.type = 'error';

      if (!context.event.data[error]) {
        var parser = context.client.config.errorParser;
        if (!parser) {
          throw new Error('No error parser was defined.');
        }

        var result = parser.parse(context, exception);
        if (!!result) {
          context.event.data[error] = result;
        }
      }
    }

    next && next();
  }
}
