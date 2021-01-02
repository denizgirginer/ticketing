import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('client not connected');
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, {
            url: url
        });
        this.init();

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS')
                resolve();
            })

            this.client.on('error', (err) => {
                reject(err);
            })


        })
    }

    init() {
        this.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();  //<== danger
        })

        //detect process exiting
        //çalışmıyor --rs parametresi araştırılacak
        //not work windows
        process.on('SIGTERM', () => {
            try {
                this.close();
            } catch (err) {
                console.log(err);
            }
        })

        process.on('SIGINT', () => {
            try {
                this.close();
            } catch (err) {
                console.log(err);
            }
        })
    }

    close() {
        this.client.close();
    }
}


export const natsClient = new NatsClient();